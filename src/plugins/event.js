import Vue from 'vue'
import { ref as mapRef } from '~/plugins/map/init'
import { ref as cloudRef } from './cloud/init'
import { imageClick } from './image/event'
import { setFocus } from './map/event'

export default ({ store: { commit, state } }) => {
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

      async clickDrawn(feature) {
        /*
         * @summary - Map Click Drawn Callback
         */
        const id = feature.getId()
        this.selectID(id)
      },

      async selectID(id) {
        /*
         * @summary - Select by Document ID
         */
        const config = this.getAuthConfig()
        const res = await this.$axios.get(`/api/facility?id=${id}`, config)
        const facility = res.data[0]
        this.selectFacility(facility)
      },

      async selectFacility(facility) {
        /*
         * @summary - Select by Facility Document
         */
        const xyz = [facility.properties.x, facility.properties.y, facility.properties.z]
        await this.drawSelectedXYZ(xyz)
        commit('selectFeature', facility)
      },

      dragSelected(event) {
        const controls = cloudRef.cloud.controls
        controls.enabled = !event.value
        if (controls.enabled) {
          const transform = cloudRef.cloud.transform
          const moved = transform.object.position
          const props = state.selected[0].properties
          const xyz = [props.x + moved.x, props.y + moved.y, props.z + moved.z]
          commit('updateGeom', xyz)
          this.selectFacility(state.selected[0])
        }
      },

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
      },

      setMark(markObj) {
        /*
         * @summary - Set Mark
         */
        commit('ls/setMark', markObj)
        this.waitAvail(this.checkMount, this.currentXYZ, [[markObj.x, markObj.y, markObj.alt]])
      },

      async imageClick(event, depth) {
        return imageClick(event, depth, this.drawFromDepth)
      },

      keyUp(event) {
        /*
         * @summary - Special Callback
         */
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
            this.resetSelected()
            cloudRef.cloud.transform.detach(cloudRef.selectedLayer)
            return
        }
      },

      keyEvent(event) {
        /*
         * @summary - Normal Key Callback
         */
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
          case 'f':
          case 'F':
            if (state.selected.length === 0) return
            const target = state.selected[state.selected.length - 1]
            const props = target.properties
            const geom = target.geometry
            if (index === 2) {
              if (!cloudRef.cloud.offset) return
              const controls = cloudRef.cloud.controls
              const offset = cloudRef.cloud.offset
              controls.target.set(props.x - offset[0], props.y - offset[1], props.z - offset[2])
            }
            if (target && mapRef.map) setFocus(geom.coordinates[1], geom.coordinates[0])
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
            }
            return
        }
        if (process.env.dev) console.log(event)
      }
    }
  })
}
