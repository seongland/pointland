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
import { drawNear, erase, updateImg } from './image/draw'
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

      drawnXYZs(xyzs, ids) {
        for (const index in xyzs) this.drawnXYZ(xyzs[index], ids[index])
      },

      drawnFacilities(currentMark) {
        let layer = state.ls.targetLayer?.object?.layer
        let url = `/api/facility/near/${currentMark.lon}/${currentMark.lat}`
        if (layer) url += `/${layer}`

        return this.$axios.get(url).then(async res => {
          await this.resetLayer('drawnLayer')
          resetPointLayer(cloudRef.drawnLayer)
          const facilities = res.data
          const [xyzs, ids] = [[], [], []]
          for (const facility of facilities) {
            const props = facility.properties
            xyzs.push([props.x, props.y, props.z])
            ids.push(facility.id)
          }
          await this.drawFacilities(facilities, currentMark, imgRef.drawnLayer)
          updateImg(imgRef.drawnLayer)
          this.waitAvail(this.checkMount, this.drawnXYZs, [xyzs, ids])
        })
      },

      async drawFacilities(facilites, currentMark, layer) {
        const xyzds = []
        for (const facility of facilites) {
          let id = facility.id ? facility.id : POINT_ID
          const props = facility.properties
          xyzds.push({ x: props.x, y: props.y, z: props.z, d: 'front', id })
          xyzds.push({ x: props.x, y: props.y, z: props.z, d: 'back', id })
        }
        const url = `/api/image/convert`
        const fbRes = await this.$axios.post(url, { data: { mark: currentMark, xyzds } })
        for (const result of fbRes.data) {
          const id = result.id
          const coor = result.coor
          const width = result.width
          const height = result.height
          const direction = result.direction
          const wfactor = width / layer[direction].image.bitmap.width
          const hfactor = height / layer[direction].image.bitmap.height
          if (coor[0] !== -1)
            drawNear(layer, { x: coor[0] / wfactor, y: coor[1] / hfactor, color: layer.color, id, direction }, false)
        }
      },

      async drawFromDepth(x, y, depthDir) {
        const targetLayer = this.$store.state.ls.targetLayer
        commit('setLoading', true)
        console.time('xy')
        if (targetLayer.object) if (targetLayer.object.type === 'Point') await this.drawSelectedXY(depthDir, x, y)
        commit('setLoading', false)
        console.timeEnd('xy')
      },

      async drawSelectedXY(depthDir, x, y) {
        const ls = this.$store.state.ls
        await this.resetSelected()
        depthDir.layer.selected.image = new jimp(depthDir.width, depthDir.height)
        drawNear(
          imgRef.selectedLayer,
          { x, y, color: imgRef.selectedLayer.color, direction: depthDir.name, id: POINT_ID },
          true
        )
        const xyzRes = await this.$axios.post(`${depthDir.url}/${x}/${y}`)
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
        await this.resetSelected()
        commit('select', {
          xyz,
          type: 'Point'
        })
        this.selectXYZ(xyz, POINT_ID)
        await this.drawFacilities(state.selected, state.ls.currentMark, imgRef.selectedLayer)
        updateImg(imgRef.selectedLayer)
      },

      async resetSelected() {
        mapRef.selectedLayer.getSource().clear()
        resetPointLayer(cloudRef.selectedLayer)
        const depth = imgRef.depth
        if (depth)
          for (const data of Object.values(depth)) {
            data.layer.selected.image = new jimp(data.width, data.height)
            const uri = await data.layer.selected.image.getBase64Async('image/png')
            data.layer.selected.uri = uri
          }
        commit('resetSelected')
        if (process.env.dev) console.log(`Reset Selected`, state.selected)
      },

      async resetLayer(name) {
        mapRef[name].getSource().clear()
        resetPointLayer(cloudRef[name])
        const imgLayer = imgRef[name]
        if (imgLayer)
          for (const direction of ['front', 'back']) {
            imgLayer[direction].image = new jimp(imgRef.depth[direction].width, imgRef.depth[direction].height)
            const uri = await imgLayer[direction].image.getBase64Async('image/png')
            imgLayer[direction].uri = uri
          }
        if (process.env.dev) console.log(`Reset ${name}`)
      },

      async resetSnap() {
        await this.resetSelected()
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
