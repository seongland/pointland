/*
 * @summary - vue draw plugin
 */

import Vue from 'vue'
import { ref as mapRef } from '~/modules/map/init'
import { ref as imgRef } from '~/modules/image/init'
import { ref as cloudRef } from '~/modules/cloud/init'

import { GeoJSON } from 'ol/format'
import { drawXY, removeFeature } from '~/modules/map/draw'
import { drawXYZ, removePoint, drawLine, drawLoop } from '~/modules/cloud/draw'
import { resetPointLayer, removeLineLoops } from '~/modules/cloud/event'
import { drawNear, erase, updateImg } from '~/modules/image/draw'
import { xyto84 } from '~/server/api/addon/tool/coor'
import jimp from 'jimp/browser/lib/jimp'
import consola from 'consola'

const POINT_ID = 'Point'

export default ({ $axios, store: { commit, state } }) => {
  Vue.mixin({
    methods: {
      async drawToImage(facilities, currentMark, layer) {
        /*
         * @summary - Draw facilities to image
         */
        const xyzdis = []
        for (const i in facilities) {
          const facility = facilities[i]
          const props = facility.properties
          if (facility.geometry.type === 'Point') {
            let id = facility.id
            const props = facility.properties
            xyzdis.push({ x: props.x, y: props.y, z: props.z, d: 'front', id, i })
            xyzdis.push({ x: props.x, y: props.y, z: props.z, d: 'back', id, i })
          } else if (facility.geometry.type === 'LineString') {
            for (const index in props.xyzs) {
              const xyz = props.xyzs[index]
              let id = facility.id + this.idSep + index
              xyzdis.push({ x: xyz[0], y: xyz[1], z: xyz[2], d: 'front', id, i })
              xyzdis.push({ x: xyz[0], y: xyz[1], z: xyz[2], d: 'back', id, i })
            }
          } else if (facility.geometry.type === 'Polygon') {
            for (const index in props.xyzs) {
              const polyline = props.xyzs[index]
              for (const index2 in polyline) {
                const xyz = props.xyzs[index][index2]
                let id = facility.id + this.idSep + index + this.idSep + index2
                xyzdis.push({ x: xyz[0], y: xyz[1], z: xyz[2], d: 'front', id, i })
                xyzdis.push({ x: xyz[0], y: xyz[1], z: xyz[2], d: 'back', id, i })
              }
            }
          }
        }
        const url = `/api/image/convert`
        const fbRes = await $axios.post(url, { data: { mark: currentMark, xyzdis } })
        // Draw to image
        for (const i in fbRes.data) {
          const result = fbRes.data[i]
          const id = result.id
          const index = result.i
          const coor = result.coor
          const width = result.width
          const height = result.height
          const direction = result.direction
          const wfactor = width / layer[direction].image.bitmap.width
          const hfactor = height / layer[direction].image.bitmap.height

          // Set Visible Property
          if (coor[0] !== -1) {
            const drawOption = { x: coor[0] / wfactor, y: coor[1] / hfactor, color: layer.color, id, direction }
            drawNear(layer, drawOption, false)
            facilities[index].relations.visible = true
          } else if (!facilities[index].relations.visible) facilities[index].relations.visible = false
        }
      },

      async selectFromDepth(event, vid) {
        /*
         * @summary - Callback From Image click
         */
        let id, index, index2
        const idSet = vid.split(this.idSep)
        id = vid
        if (idSet.length > 1) {
          id = idSet[0]
          index = idSet[1]
          index2 = idSet[2]
        }
        this.selectID(id, index, index2, event)
      },

      async drawFromDepth(event, x, y, depthDir) {
        /*
         * @summary - Callback From Image click
         */
        const targetLayer = this.$store.state.ls.targetLayer
        commit('setLoading', true)
        console.time('xy')
        if (targetLayer.object) if (targetLayer.object.type === 'Point') await this.newFacilityByXY(depthDir, x, y, event)
        commit('setLoading', false)
        console.timeEnd('xy')
      }
    }
  })
}
