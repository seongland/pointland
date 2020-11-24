import Vue from 'vue'
import { ref as mapRef } from '~/plugins/map/init'
import { ref as cloudRef } from './cloud/init'
import { clickImage } from './image/event'
import { setFocus } from './map/event'
import { setFocusXYZ } from './cloud/event'
import consola from 'consola'

export default ({ store: { commit, state, $router } }) => {
  Vue.mixin({
    methods: {
      setLayer: data => commit('ls/setLayer', data),
      setRound: round => commit('ls/setRound', round),
      setRounds: rounds => commit('ls/setRounds', rounds),
      checkMount: () => mapRef.map !== undefined && cloudRef.cloud.offset !== undefined,
      getAuthConfig: () => ({ headers: { Authorization: state.ls.accessToken } }),

      async waitAvail(flag, callback, args) {
        /*
         * @summary - Wait for mount template function
         */
        flag() ? callback(...args) : setTimeout(() => this.waitAvail(flag, callback, args), 1000)
      },

      clickMark(feature) {
        /*
         * @summary - Map Click Mark Callback
         */
        if (feature) {
          const markId = feature.getId()
          for (const markObj of state.ls.currentSnap.marks) if (markObj.name === markId) this.setMark(markObj)
        }
      },

      clickProcessed(feature) {
        /*
         * @summary - Map Click Processed geoserver mark
         */
        const roundName = feature.get('round')
        const snapName = feature.get('snap')
        const markName = feature.get('name')
        if (process.env.dev) consola.info('Click', roundName, snapName, markName)
        for (const roundObj of state.ls.rounds)
          if (roundObj.name === roundName) this.setRound({ ...roundObj, snap: snapName, mark: markName })
      },

      async clickDrawn(feature) {
        /*
         * @summary - Map Click Drawn Callback
         */
        let id, vid, index, index2
        vid = feature.getId()
        const idSet = vid.split(this.idSep)
        id = vid
        if (idSet.length > 1) {
          id = idSet[0]
          index = idSet[1]
          index2 = idSet[2]
        }
        this.selectID(id, index, index2)
      },

      async selectID(id, index, index2) {
        /*
         * @summary - Select by Document ID
         */
        // check ing
        if (process.env.dev) consola.info('Select', id, index, index2)
        if (state.submit.ing) commit('setState', { props: ['submit', 'show'], value: true })
        else if (state.edit.ing) commit('setState', { props: ['edit', 'show'], value: true })
        if (state.edit.ing || state.submit.ing) {
          const target = state.edit.ing ? state.edit.target : state.submit.target
          const targetProp = state.selected[0].properties[target]
          if (targetProp instanceof Array)
            commit('setState', { props: ['selected', 0, 'properties', target, targetProp.length], value: id })
          else commit('setState', { props: ['selected', 0, 'properties', target], value: id })
          return this.drawnFacilities()
        }
        const facility = await this.getFacilityByID(id)
        if (facility) await this.selectFacility(facility, index, index2)
      },

      async getFacilityByID(id) {
        for (const facility of state.facilities) if (id === facility.id) return facility
        const config = this.getAuthConfig()
        const res = await this.$axios.get(`/api/facility?id=${id}`, config)
        return res.data[0]
      },

      async selectFacility(facility, index, index2) {
        /*
         * @summary - Select by Facility Document
         */
        let xyz
        const geom = facility.geometry
        const props = facility.properties

        if (geom.type === 'Point') xyz = [props.x, props.y, props.z]
        else if (geom.type === 'LineString') {
          if (!index) index = 0
          else facility.index = index
          xyz = props.xyzs[index]
        } else if (geom.type === 'Polygon') {
          if (index === undefined) index = 0
          else facility.index = index

          if (index2 === undefined) index2 = 0
          else facility.index2 = index2
          xyz = props.xyzs[index][index2]
        }

        // Draw Related
        for (const prop in props) {
          const value = props[prop]
          for (const group of this.groups)
            for (const layerOpt of group.layers)
              if (layerOpt.layer === props.layer && value) {
                if (['relate', 'multirelate'].includes(layerOpt.attributes?.[prop]?.method)) this.drawRelated(value)
              }
        }
        this.drawRelated(facility.id)

        await this.drawSelectedXYZ(xyz)
        commit('selectFeature', facility)
      },

      dragSelected(event) {
        const controls = cloudRef.cloud.controls
        controls.enabled = !event.value
        if (controls.enabled) {
          let position
          const transform = cloudRef.cloud.transform
          const moved = transform.object.position
          const props = state.selected[0].properties
          const geom = state.selected[0].geometry

          if (geom.type === 'Point') position = [props.x + moved.x, props.y + moved.y, props.z + moved.z]
          else if (geom.type === 'LineString') {
            const xyz = props.xyzs[state.selected[0].index]
            position = [xyz[0] + moved.x, xyz[1] + moved.y, xyz[2] + moved.z]
          } else if (geom.type === 'Polygon') {
            const xyz = props.xyzs[state.selected[0].index][state.selected[0].index2]
            position = [xyz[0] + moved.x, xyz[1] + moved.y, xyz[2] + moved.z]
          }

          commit('updateGeom', position)
          this.selectFacility(state.selected[0], state.selected[0].index, state.selected[0].index2)
        }
      },

      layerSelected: () => state.ls.targetLayer.object,
      layerUnSelected: () => !state.ls.targetLayer.object,

      async setSnap(snapObj) {
        /*
         * @summary - Set Snap
         */
        commit('setLoading', true)
        snapObj.round = state.ls.currentRound.name

        // Get Snap Object
        const apiUrl = `/api/meta/${snapObj.round}/${snapObj.name}`
        const config = this.getAuthConfig()
        config.data = { snap: snapObj }
        const snapRes = await this.$axios.post(apiUrl, config)
        snapObj.areas = snapRes.data.areas
        snapObj.marks = snapRes.data.marks
        const previous = state.ls.currentSnap

        // Check Previous
        if (previous && !(snapObj.name === previous.name && previous.round === snapObj.round)) await this.resetSnap()
        commit('ls/setSnap', snapObj)
        for (const mark of snapObj.marks)
          this.waitAvail(this.checkMount, this.markXYZ, [[mark.x, mark.y, mark.alt], mark.name])

        const currentMark = state.ls.currentMark
        this.waitAvail(this.checkMount, setFocusXYZ, [[currentMark.x, currentMark.y, currentMark.alt]])
      },

      setMark(markObj) {
        /*
         * @summary - Set Mark
         */
        commit('ls/setMark', markObj)
        this.waitAvail(this.checkMount, this.currentXYZ, [[markObj.x, markObj.y, markObj.alt]])
      },

      async clickImage(event, depth) {
        return clickImage(event, depth, this.drawFromDepth, this.selectFromDepth)
      },

      keyUp(event) {
        /*
         * @summary - Special Callback
         */
        if ($router.currentRoute.name !== 'draw') return
        if (state.submit.show || state.edit.show || state.del.ing || state.loading) return
        switch (event.key) {
          case 'Delete':
            const selected = state.selected
            if (selected[0]?.id) {
              commit('setState', { props: ['del', 'id'], value: selected[0].id })
              commit('setState', { props: ['del', 'ing'], value: true })
            }
            return
          case 'Escape':
            if (state.submit.ing || state.edit.ing) this.drawnFacilities()

            if (state.selected.length > 0) this.resetSelected()
            else this.drawnFacilities()
            return
        }
      },

      keyEvent(event) {
        /*
         * @summary - Normal Key Callback
         */
        if ($router.currentRoute.name !== 'draw') return
        if (state.submit.show || state.edit.show || state.del.ing || state.loading) return
        let seqIndex
        const ls = this.$store.state.ls
        const index = this.$store.state.ls.index
        switch (event.key) {
          // change seq
          case ',':
            seqIndex = ls.currentSnap.marks.indexOf(ls.currentMark)
            if (seqIndex > 0) if (!state.depth.loading) this.setMark(ls.currentSnap.marks[seqIndex - 1])
            return
          case '.':
            seqIndex = ls.currentSnap.marks.indexOf(ls.currentMark)
            if (seqIndex < ls.currentSnap.marks.length - 1)
              if (!state.depth.loading) this.setMark(ls.currentSnap.marks[seqIndex + 1])
            return

          case 't':
          case 'T':
            if (state.selected.length > 0) {
              cloudRef.cloud.transform.visible = !state.visible.transform
              cloudRef.cloud.transform.enabled = !state.visible.transform
            }
            commit('setState', { props: ['visible', 'transform'], value: !state.visible.transform })
            return

          // change tabs
          case '1':
            return commit('ls/setIndex', Number(event.key) - 1)
          case '2':
            return commit('ls/setIndex', Number(event.key) - 1)
          case '3':
            return commit('ls/setIndex', Number(event.key) - 1)

          // Toggle
          case 'm':
          case 'M':
            if (index === 0) return
            const mapWrapper = document.getElementById('global-map')?.parentElement
            if (!mapWrapper) return
            if (!mapWrapper.classList.contains('small-map')) return mapWrapper.classList.add('small-map')
            if (this.tabs[0].show) mapWrapper.setAttribute('style', 'z-index:-1 !important')
            else mapWrapper.setAttribute('style', 'z-index:5 !important')
            this.tabs[0].show = !this.tabs[0].show
            return

          // UI control
          case ' ':
            if (index === 2) {
              if (!cloudRef.cloud.offset) return
              const markObj = ls.currentMark
              const controls = cloudRef.cloud.controls
              const offset = cloudRef.cloud.offset
              const camera = cloudRef.cloud.camera
              camera.position.set(markObj.x - offset[0], markObj.y - offset[1], markObj.alt - offset[2] + 50)
              controls.target.set(markObj.x - offset[0], markObj.y - offset[1], markObj.alt - offset[2])
            }
            if (state.ls.currentMark) setFocus(state.ls.currentMark.lat, state.ls.currentMark.lon)
            return

          // Focus Selected - Cloud Only
          case 'f':
          case 'F':
            if (state.selected.length === 0) return
            const target = state.selected[state.selected.length - 1]
            const props = target.properties
            if (index === 2) {
              if (!cloudRef.cloud.offset) return
              const controls = cloudRef.cloud.controls
              const offset = cloudRef.cloud.offset
              if (target.geometry.type === 'Point')
                controls.target.set(props.x - offset[0], props.y - offset[1], props.z - offset[2])
              else if (target.geometry.type === 'LineString') {
                const xyz = target.properties.xyzs[target.index]
                controls.target.set(xyz[0] - offset[0], xyz[1] - offset[1], xyz[2] - offset[2])
              } else if (target.geometry.type === 'Polygon') {
                const xyz = target.properties.xyzs[target.index][target.index2]
                controls.target.set(xyz[0] - offset[0], xyz[1] - offset[1], xyz[2] - offset[2])
              }
            }
            return

          // Focus Hover - Cloud Only
          case 'h':
          case 'h':
            if (!cloudRef.cloud.currentHover) return
            const hovered = cloudRef.cloud.currentHover.point
            if (index === 2) {
              if (!cloudRef.cloud.offset) return
              const controls = cloudRef.cloud.controls
              controls.target.set(hovered.x, hovered.y, hovered.z)
            }
            return

          // Submit
          case 'Enter':
            if (state.selected.length > 0) {
              if (state.selected[0].id) {
                const selected = state.selected
                commit('setState', { props: ['edit', 'id'], value: selected[0].id })
                commit('setState', { props: ['edit', 'ing'], value: true })
                commit('setState', { props: ['edit', 'show'], value: true })
                return
              } else {
                if (!state.allowedLayers.includes(state.ls.targetLayer.object?.layer)) return
                commit('setState', { props: ['submit', 'ing'], value: true })
                commit('setState', { props: ['submit', 'show'], value: true })
              }
            } else this.drawnFacilities()
            return
        }
        if (process.env.dev) consola.info('Pressed', event.key)
      }
    }
  })
}
