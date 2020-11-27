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
        event.ctrlKey = window.ctrlKey
        event.shiftKey = window.shiftKey
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
        let selected = this.getSelected(facility)
        let xyz = this.setIndexGetXYZ(facility, index, index2, event, selected)

        // Debugging
        if (process.env.target === 'facility') {
          consola.info('ID', facility.id)
          consola.info('Indexes', facility.indexes)
          consola.info('selected : ', selected)
          consola.info('Facility : ', facility)
          consola.info('Event : ', event)
        }

        // Data Control
        await this.resetSelected()
        commit('selectFeature', facility)

        // Draw Selected
        this.drawRelated(facility)
        const geom = facility.geometry
        if (geom.type === 'Point') await this.drawPointXYZ(xyz, facility.id, event)
        else if (geom.type === 'LineString')
          for (const i of facility.indexes) {
            const xyz = facility.properties.xyzs[i]
            const vid = facility.id + this.idSep + i
            if (process.env.target === 'facility') consola.info('Draw Select', xyz, vid)
            this.drawPointXYZ(xyz, vid, event)
          }
        else if (geom.type === 'Polygon')
          for (const vidSet of facility.indexes) {
            const xyz = facility.properties.xyzs[vidSet[0]][vidSet[1]]
            const vid = facility.id + this.idSep + vidSet[0] + this.idSep + vidSet[1]
            if (process.env.target === 'facility') consola.info('Draw Select', xyz, vid)
            this.drawPointXYZ(xyz, vid, event)
          }
      },

      setIndexGetXYZ(facility, index, index2, event, selected) {
        /*
         * @summary - Set Facility index per depth & return that index's XYZ
         */
        const geom = facility.geometry
        const props = facility.properties
        if (geom.type === 'Point') return [props.x, props.y, props.z]
        else if (geom.type === 'LineString') {
          if (!index) index = 0
          else facility.index = Number(index)
          if (!facility.indexes) facility.indexes = [facility.index]
          if (!event.ctrlKey && !event.shiftKey) facility.indexes = [facility.index]
          else if (selected)
            if (event.ctrlKey) facility.indexes.push(facility.index)
            else if (event.shiftKey) {
              const firstI = facility.indexes[0]
              const shiftList = new Array(Math.abs(firstI - index)).fill(0)
              facility.indexes = [facility.indexes[0]]
              for (const i in shiftList) {
                const factor = Number(i) + 1
                const sIndex = firstI < index ? firstI + factor : firstI - factor
                facility.indexes.push(sIndex)
              }
            }
          return props.xyzs[index]
        } else if (geom.type === 'Polygon') {
          if (index === undefined) index = 0
          else facility.index = Number(index)
          if (index2 === undefined) index2 = 0
          else facility.index2 = Number(index2)
          if (!facility.indexes) facility.indexes = [[facility.index, facility.index2]]
          if (!event.ctrlKey && !event.shiftKey) facility.indexes = [[facility.index, facility.index2]]
          else if (selected)
            if (event.ctrlKey) facility.indexes.push([facility.index, facility.index2])
            else if (event.shiftKey) {
              const firstI2 = facility.indexes[index][1]
              const shiftList = new Array(Math.abs(firstI2 - index2)).fill(0)
              facility.indexes = [facility.indexes[0]]
              for (const i in shiftList) {
                const factor = Number(i) + 1
                const sIndex = firstI2 < index2 ? firstI2 + factor : firstI2 - factor
                const idSet = [Number(index), sIndex]
                facility.indexes.push(idSet)
              }
            }
          return props.xyzs[index][index2]
        }
      },

      getSelected(facility) {
        return facility.id === state.selected?.[0]?.id
      },

      dragSelected(dragEvent) {
        const controls = cloudRef.cloud.controls
        controls.enabled = !dragEvent.value
        if (controls.enabled) {
          const transform = cloudRef.cloud.transform
          const moved = transform.object.position
          const geom = state.selected[0].geometry

          // Drag Event Per type
          const mouseEvent = { ctrlKey: window.ctrlKey, shiftKey: window.shiftKey }
          if (window.ctrlKey && geom.type !== 'Point') {
            commit('translate', moved)
            return this.selectFacility(state.selected[0], state.selected[0].index, state.selected[0].index2, mouseEvent)
          }
          if (geom.type === 'Point') commit('translateIndex', { offset: moved })
          else if (geom.type === 'LineString')
            for (const sIndex of state.selected[0].indexes) commit('translateIndex', { offset: moved, index: sIndex })
          else if (geom.type === 'Polygon')
            for (const idSet of state.selected[0].indexes)
              commit('translateIndex', { offset: moved, index: idSet[0], index2: idSet[1] })

          this.selectFacility(state.selected[0], state.selected[0].index, state.selected[0].index2, mouseEvent)
        }
      },

      layerSelected: () => state.ls.targetLayer.object,
      layerUnSelected: () => !state.ls.targetLayer.object
    }
  })
}
