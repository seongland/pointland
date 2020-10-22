import Vue from 'vue'
import { ref as mapRef } from '~/plugins/map/init'
import { ref as imgRef } from '~/plugins/image/init'
import { ref as cloudRef } from './cloud/init'

import { drawXY, removeFeature } from './map/draw'
import { drawLas, drawXYZ, removePoint } from './cloud/draw'
import { resetPointLayer } from './cloud/event'
import { drawNear, erase } from './image/draw'
import { xyto84 } from '~/server/api/addon/tool/coor'
import jimp from 'jimp/browser/lib/jimp'

export default ({ store: { commit, state } }) => {
  Vue.mixin({
    methods: {
      removeVector(layerName, id) {
        const mapLayer = mapRef[layerName]
        const cloudLayer = cloudRef[layerName]
        const imgLayer = imgRef[layerName]
        if (!mapLayer || !cloudLayer) return
        removeFeature(mapLayer, id)
        removePoint(cloudLayer, id)
        erase(imgLayer, id)
      },

      drawLas: lasJson => drawLas(lasJson),

      selectXYZ(xyz, id) {
        const lnglat = xyto84(xyz[0], xyz[1])
        const latlng = lnglat.reverse()
        drawXY(mapRef.selectedLayer, latlng, false, id)
        drawXYZ(cloudRef.selectedLayer, xyz, false, id)
      },

      markXYZ(xyz, id) {
        const lnglat = xyto84(xyz[0], xyz[1])
        const latlng = lnglat.reverse()
        drawXY(mapRef.markLayer, latlng, false, id)
        drawXYZ(cloudRef.markLayer, xyz, false, id)
      },

      currentXYZ(xyz) {
        resetPointLayer(cloudRef.currentLayer)
        const lnglat = xyto84(xyz[0], xyz[1])
        const latlng = lnglat.reverse()
        drawXY(mapRef.currentLayer, latlng, true, 'current')
        drawXYZ(cloudRef.currentLayer, xyz, true, 'current')
      },

      drawnXYZ(xyz, id) {
        const lnglat = xyto84(xyz[0], xyz[1])
        const latlng = lnglat.reverse()
        drawXY(mapRef.drawnLayer, latlng, false, id)
        drawXYZ(cloudRef.drawnLayer, xyz, false, id)
      },

      drawFacilities(currentMark, depth) {
        return this.$axios.get(`/api/facility/near/${currentMark.lon}/${currentMark.lat}`).then(res => {
          resetPointLayer(cloudRef.drawnLayer)
          const facilites = res.data
          for (const facility of facilites) {
            for (const image of facility.relations.images)
              if (image.name == currentMark.name) {
                const img = depth[image.direction].layer.drawn.image

                drawNear(imgRef.drawnLayer, {
                  x: image.coordinates[0],
                  y: image.coordinates[1],
                  color: 0x9911ffff,
                  id: facility.id,
                  direction: image.direction
                })
              }
            const xyz = [facility.properties.x, facility.properties.y, facility.properties.z]
            this.waitAvail(this.checkMount, this.drawnXYZ, [xyz, facility.id])
          }
        })
      },

      async drawFromDepth(x, y, data) {
        const targetLayer = this.$store.state.targetLayer
        const ls = this.$store.state.ls
        if (targetLayer.object) {
          if (targetLayer.object.type === 'Point') {
            this.resetSelectedExcept(data)
            data.layer.selected.image = new jimp(data.width, data.height)
            drawNear(imgRef.selectedLayer, { x, y, color: 0xff5599ff, direction: data.name, id: 'selected' })
            const xyzRes = await this.$axios.get(`${data.url}/${x}/${y}`)
            const xyz = xyzRes.data

            commit('select', {
              xyz,
              type: 'Point',
              images: [
                {
                  round: ls.currentRound.name,
                  snap: ls.currentSnap.name,
                  name: ls.currentMark.name,
                  direction: data.name,
                  coordinates: [x, y]
                }
              ]
            })
            this.selectXYZ(xyz, 'Point')
          }
        }
      },

      resetSelectedExcept(excepted) {
        let data
        if (imgRef.depth.front !== excepted) {
          data = imgRef.depth.front
          data.layer.selected.image = new jimp(data.width, data.height)
          data.layer.selected.image.getBase64Async('image/png').then(uri => (data.layer.selected.uri = uri))
        }
        if (imgRef.depth.back !== excepted) {
          data = imgRef.depth.back
          data.layer.selected.image = new jimp(data.width, data.height)
          data.layer.selected.image.getBase64Async('image/png').then(uri => (data.layer.selected.uri = uri))
        }
      },

      resetSelected() {
        const depth = imgRef.depth
        if (!depth) return
        commit('setSubmitting', false)
        commit('setShowSubmit', false)
        for (const data of Object.values(depth)) {
          data.layer.selected.image = new jimp(data.width, data.height)
          data.layer.selected.image.getBase64Async('image/png').then(uri => (data.layer.selected.uri = uri))
        }
        mapRef.selectedLayer.getSource().clear()
        resetPointLayer(cloudRef.selectedLayer)
        commit('resetSelected')
        if (process.env.dev) console.log(`Reset Selected`, state.selected)
      },

      resetSnap() {
        this.resetSelected()
        if (mapRef.markLayer) mapRef.markLayer.getSource().clear()
        if (cloudRef.markLayer) resetPointLayer(cloudRef.markLayer)
        if (cloudRef.points) for (const pointLayer of cloudRef.points) resetPointLayer(pointLayer)
      }
    }
  })
}
