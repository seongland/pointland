import Vue from 'vue'
import { ref as mapRef } from '~/plugins/map/init'
import { ref as imgRef } from '~/plugins/image/init'
import { drawXY } from './map/draw'
import { ref as cloudRef } from './cloud/init'
import { drawLas, drawXYZ } from './cloud/draw'
import { resetPointLayer } from './cloud/event'
import { xyto84 } from '~/server/api/addon/tool/coor'
import jimp from 'jimp/browser/lib/jimp'

export default ({ store: { commit, state } }) => {
  Vue.mixin({
    methods: {
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

      drawNear(image, x, y) {
        image.setPixelColor(0x8866ffff, x, y)
        image.setPixelColor(0x8866ffff, x - 1, y - 1)
        image.setPixelColor(0x8866ffff, x + 1, y + 1)
        image.setPixelColor(0x8866ffff, x + 1, y - 1)
        image.setPixelColor(0x8866ffff, x - 1, y + 1)
        image.setPixelColor(0x8866ffff, x, y - 1)
        image.setPixelColor(0x8866ffff, x, y + 1)
        image.setPixelColor(0x8866ffff, x + 1, y)
        image.setPixelColor(0x8866ffff, x - 1, y)
      },

      async drawFromDepth(x, y, data) {
        const targetLayer = this.$store.state.targetLayer
        const ls = this.$store.state.ls
        if (targetLayer.object) {
          if (targetLayer.object.type === 'Point') {
            this.resetSelectedExcept(data)
            data.layer.selected.image = new jimp(data.width, data.height)
            this.drawNear(data.layer.selected.image, x, y)
            data.layer.selected.image.getBase64Async('image/png').then(uri => (data.layer.selected.uri = uri))
            const res = await this.$axios.get(`${data.url}/${x}/${y}`)
            const xyz = res.data

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
        if (this.depth.front !== excepted) {
          data = this.depth.front
          data.layer.selected.image = new jimp(data.width, data.height)
          data.layer.selected.image.getBase64Async('image/png').then(uri => (data.layer.selected.uri = uri))
        }
        if (this.depth.back !== excepted) {
          data = this.depth.back
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
