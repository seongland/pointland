/*
 * @summary - vue draw plugin
 */

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

const POINT_ID = 'Point'

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

      drawLas: (lasJson, name) => drawLas(lasJson, name),

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

      drawnFacilities(currentMark) {
        return this.$axios.get(`/api/facility/near/${currentMark.lon}/${currentMark.lat}`).then(res => {
          resetPointLayer(cloudRef.drawnLayer)
          const facilites = res.data
          for (const facility of facilites) {
            this.drawFacility(facility, currentMark, imgRef.drawnLayer)
            const props = facility.properties
            const xyz = [props.x, props.y, props.z]
            this.waitAvail(this.checkMount, this.drawnXYZ, [xyz, facility.id])
          }
        })
      },

      drawFacility(facility, currentMark, layer) {
        const props = facility.properties
        let id
        if (facility.id) id = facility.id
        else id = POINT_ID

        let url
        for (const direction of ['front', 'back']) {
          url = `/api/image/r/s/m/${direction}/convert/${props.x}/${props.y}/${props.z}`
          this.$axios.post(url, { data: { mark: currentMark } }).then(res => {
            const coor = res.data.coor
            const width = res.data.width
            const height = res.data.height
            const wfactor = width / layer[direction].image.bitmap.width
            const hfactor = height / layer[direction].image.bitmap.height
            if (coor[0] !== -1)
              drawNear(layer, {
                x: coor[0] / wfactor,
                y: coor[1] / hfactor,
                color: layer.color,
                id,
                direction
              })
          })
        }
      },

      async drawFromDepth(x, y, depthDir) {
        const targetLayer = this.$store.state.targetLayer
        if (targetLayer.object) if (targetLayer.object.type === 'Point') this.drawSelectedXY(depthDir, x, y)
      },

      async drawSelectedXY(depthDir, x, y) {
        const ls = this.$store.state.ls
        this.resetSelectedExcept(depthDir)
        depthDir.layer.selected.image = new jimp(depthDir.width, depthDir.height)
        drawNear(imgRef.selectedLayer, { x, y, color: imgRef.selectedLayer.color, direction: depthDir.name, id: POINT_ID })
        const xyzRes = await this.$axios.get(`${depthDir.url}/${x}/${y}`)
        const xyz = xyzRes.data
        commit('select', {
          xyz,
          type: 'Point',
          images: [
            {
              round: ls.currentRound.name,
              snap: ls.currentSnap.name,
              name: ls.currentMark.name,
              direction: depthDir.name,
              coordinates: [x, y]
            }
          ]
        })
        this.selectXYZ(xyz, POINT_ID)
      },

      async drawSelectedXYZ(xyz) {
        this.resetSelected()
        commit('select', {
          xyz,
          type: 'Point'
        })
        this.selectXYZ(xyz, POINT_ID)
        this.drawFacility(state.selected[0], state.ls.currentMark, imgRef.selectedLayer)
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
        mapRef.selectedLayer.getSource().clear()
        resetPointLayer(cloudRef.selectedLayer)
        const depth = imgRef.depth
        if (depth)
          for (const data of Object.values(depth)) {
            data.layer.selected.image = new jimp(data.width, data.height)
            data.layer.selected.image.getBase64Async('image/png').then(uri => (data.layer.selected.uri = uri))
          }
        commit('resetSelected')
        if (process.env.dev) console.log(`Reset Selected`, state.selected)
      },

      resetSnap() {
        this.resetSelected()
        if (mapRef.markLayer) mapRef.markLayer.getSource().clear()
        if (mapRef.markLayer) mapRef.drawnLayer.getSource().clear()
        if (cloudRef.markLayer) resetPointLayer(cloudRef.markLayer)
        if (cloudRef.markLayer) resetPointLayer(cloudRef.drawnLayer)
        if (cloudRef.cloud.points) for (const pointLayer of cloudRef.cloud.points) cloudRef.cloud.scene.remove(pointLayer)

        cloudRef.cloud.points = []
      }
    }
  })
}
