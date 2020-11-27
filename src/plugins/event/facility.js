import Vue from 'vue'
import { ref as cloudRef } from '~/modules/cloud/init'
import consola from 'consola'

export default ({ store: { commit, state } }) => {
  Vue.mixin({
    methods: {
      setLayer: data => commit('ls/setLayer', data),

      async clickDrawn(event, feature) {
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
        this.selectID(id, index, index2, event)
      },

      async selectID(id, index, index2, event) {
        /*
         * @summary - Select by Document ID
         */

        // Check Relating
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

        // Link to selct facility Event
        const facility = await this.getFacilityByID(id)
        if (facility) await this.selectFacility(facility, index, index2, event)
      },

      async getFacilityByID(id) {
        for (const facility of state.facilities) if (id === facility.id) return facility
        const config = this.getAuthConfig()
        const res = await this.$axios.get(`/api/facility?id=${id}`, config)
        return res.data[0]
      },

      async selectFacility(facility, index, index2, event) {
        /*
         * @summary - Select by Facility Document
         */
        // Get Target point index
        let exist = this.getExist(facility)
        let xyz = this.setIndexGetXYZ(facility, index, index2, event, exist)

        // Draw and Save to store
        if (process.env.target === 'facility')
          consola.info('ID', facility.id, index ? index : '', index2 ? index2 : '', facility, 'exist : ', exist)
        this.drawRelated(facility)
        if ((!event.ctrlKey && !event.shiftKey) || exist) await this.resetSelected()
        commit('selectFeature', facility)
        await this.drawPointXYZ(xyz, event)
      },

      setIndexGetXYZ(facility, index, index2, event, exist) {
        const geom = facility.geometry
        const props = facility.properties
        let xyz
        if (geom.type === 'Point') xyz = [props.x, props.y, props.z]
        else if (geom.type === 'LineString') {
          // linestring current index
          if (!index) index = 0
          else facility.index = index

          // linestring indexes
          if (!facility.indexes) facility.indexes = [facility.index]
          else if (exist)
            if (event.ctrlKey) facility.indexes.push(facility.index, facility.index2)
            else if (event.shiftKey) {
              const firstI = facility.indexes[0]
              const shiftList = new Array(Math.abs(firstI - index)).fill().map((_, i) => i + Math.min(firstI, index) + 1)
              for (const i of shiftList) facility.indexes.push(i)
            }
          xyz = props.xyzs[index]
        } else if (geom.type === 'Polygon') {
          // polygon current index
          if (index === undefined) index = 0
          else facility.index = index
          if (index2 === undefined) index2 = 0
          else facility.index2 = index2

          // Polygon indexes
          if (!facility.indexes) facility.indexes = [[facility.index, facility.index2]]
          else if (exist)
            if (event.ctrlKey) facility.indexes.push([facility.index, facility.index2])
            else if (event.shiftKey) {
              const firstI2 = facility.indexes[index][1]
              const shiftList = new Array(Math.abs(firstI2 - index2)).fill().map((_, i) => i + Math.min(firstI2, index2) + 1)
              for (const i2 of shiftList) facility.indexes.push([index, i2])
            }
          xyz = props.xyzs[index][index2]
        }
        return xyz
      },

      getExist(facility) {
        return facility.id === state.selected?.[0]?.id
      },

      dragSelected(dragEvent) {
        const mouseEvent = {
          ctrlKey: window.ctrlKey,
          shiftKey: window.shiftKey
        }
        const controls = cloudRef.cloud.controls
        controls.enabled = !dragEvent.value
        if (controls.enabled) {
          let position
          const transform = cloudRef.cloud.transform
          const moved = transform.object.position
          const props = state.selected[0].properties
          const geom = state.selected[0].geometry

          if (window.ctrlKey && geom.type !== 'Point') {
            commit('translate', moved)
            return this.selectFacility(state.selected[0], state.selected[0].index, state.selected[0].index2, mouseEvent)
          }

          if (geom.type === 'Point') position = [props.x + moved.x, props.y + moved.y, props.z + moved.z]
          else if (geom.type === 'LineString') {
            const xyz = props.xyzs[state.selected[0].index]
            position = [xyz[0] + moved.x, xyz[1] + moved.y, xyz[2] + moved.z]
          } else if (geom.type === 'Polygon') {
            const xyz = props.xyzs[state.selected[0].index][state.selected[0].index2]
            position = [xyz[0] + moved.x, xyz[1] + moved.y, xyz[2] + moved.z]
          }

          commit('updateGeom', position)
          this.selectFacility(state.selected[0], state.selected[0].index, state.selected[0].index2, mouseEvent)
        }
      },

      layerSelected: () => state.ls.targetLayer.object,
      layerUnSelected: () => !state.ls.targetLayer.object
    }
  })
}
