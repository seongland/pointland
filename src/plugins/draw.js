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
      drawLas: (lasJson, name) => drawLas(lasJson, name),

      removeVector(layerName, id) {
        /*
         * @summary - Rmove One Vector from All layer by id
         */
        const mapLayer = mapRef[layerName]
        const cloudLayer = cloudRef[layerName]
        const imgLayer = imgRef[layerName]
        if (!mapLayer || !cloudLayer) return
        removeFeature(mapLayer, id)
        removePoint(cloudLayer, id)
        erase(imgLayer, id)
      },

      selectXYZ(xyz, id) {
        /*
         * @summary - Draw Selected Facility
         */
        const lnglat = xyto84(xyz[0], xyz[1])
        const latlng = lnglat.reverse()
        drawXY(mapRef.selectedLayer, latlng, false, id)

        const transform = cloudRef.cloud.transform
        transform.position.x = xyz[0] - cloudRef.cloud.offset[0]
        transform.position.y = xyz[1] - cloudRef.cloud.offset[1]
        transform.position.z = xyz[2] - cloudRef.cloud.offset[2]
        transform.scale.x = 1
        transform.scale.y = 1
        transform.scale.z = 1
        transform.attach(cloudRef.selectedLayer)

        const object = cloudRef.selectedLayer
        object.updateMatrix()
        object.geometry.applyMatrix4(object.matrix)
        object.position.set(0, 0, 0)
        object.updateMatrix()

        drawXYZ(cloudRef.selectedLayer, xyz, false, id)
      },

      markXYZ(xyz, id) {
        /*
         * @summary - Draw Mark
         */
        const lnglat = xyto84(xyz[0], xyz[1])
        const latlng = lnglat.reverse()
        drawXY(mapRef.markLayer, latlng, false, id)
        drawXYZ(cloudRef.markLayer, xyz, false, id)
      },

      currentXYZ(xyz) {
        /*
         * @summary - Draw Current Mark
         */
        resetPointLayer(cloudRef.currentLayer)
        const lnglat = xyto84(xyz[0], xyz[1])
        const latlng = lnglat.reverse()
        drawXY(mapRef.currentLayer, latlng, true, 'current')
        drawXYZ(cloudRef.currentLayer, xyz, true, 'current')
      },

      drawnXYZ(xyz, id) {
        /*
         * @summary - Draw drawn Facility
         */
        const lnglat = xyto84(xyz[0], xyz[1])
        const latlng = lnglat.reverse()
        drawXY(mapRef.drawnLayer, latlng, false, id)
        drawXYZ(cloudRef.drawnLayer, xyz, false, id)
      },

      drawnXYZs(xyzs, ids) {
        /*
         * @summary - Draw drawn Facilities
         */
        for (const index in xyzs) this.drawnXYZ(xyzs[index], ids[index])
      },

      async drawnFacilities(currentMark) {
        /*
         * @summary - Get & Draw drawn Facilities
         */
        commit('setLoading', true)
        let layer = state.ls.targetLayer?.object?.layer
        let url = `/api/facility/near/${currentMark.lon}/${currentMark.lat}/${state.distance.max}`
        if (layer) url += `/${layer}`

        // reset
        await this.resetLayer('drawnLayer')
        resetPointLayer(cloudRef.drawnLayer)

        // get Facilities
        const res = await this.$axios.get(url)
        const facilities = res.data
        const task = state.ls.targetTask
        let filteredFacilities = facilities
        if (task) filteredFacilities = filteredFacilities.filter(item => item.relations[task.prop] === task.data)
        commit('setState', { props: ['facilities'], value: filteredFacilities })

        // Draw to Image
        await this.drawFacilities(filteredFacilities, currentMark, imgRef.drawnLayer)
        updateImg(imgRef.drawnLayer)

        // Draw to Map and Cloud
        const [xyzs, ids] = [[], []]
        for (const facility of filteredFacilities) {
          const props = facility.properties
          xyzs.push([props.x, props.y, props.z])
          ids.push(facility.id)
        }
        this.waitAvail(this.checkMount, this.drawnXYZs, [xyzs, ids])
        commit('setLoading', false)
      },

      async drawFacilities(facilities, currentMark, layer) {
        /*
         * @summary - Draw facilities to image
         */
        const xyzds = []
        for (const facility of facilities) {
          let id = facility.id ? facility.id : POINT_ID
          const props = facility.properties
          xyzds.push({ x: props.x, y: props.y, z: props.z, d: 'front', id })
          xyzds.push({ x: props.x, y: props.y, z: props.z, d: 'back', id })
        }
        const url = `/api/image/convert`
        const fbRes = await this.$axios.post(url, { data: { mark: currentMark, xyzds } })

        // Draw to image
        for (const i in fbRes.data) {
          const result = fbRes.data[i]
          const id = result.id
          const coor = result.coor
          const width = result.width
          const height = result.height
          const direction = result.direction
          const wfactor = width / layer[direction].image.bitmap.width
          const hfactor = height / layer[direction].image.bitmap.height

          // Set Visible Property
          const index = Math.floor(i / 2)
          if (coor[0] !== -1) {
            const drawOption = { x: coor[0] / wfactor, y: coor[1] / hfactor, color: layer.color, id, direction }
            drawNear(layer, drawOption, false)
            facilities[index].relations.visible = true
          } else if (!facilities[index].relations.visible) facilities[index].relations.visible = false
        }
      },

      async drawFromDepth(x, y, depthDir) {
        /*
         * @summary - Callback From Image click
         */
        const targetLayer = this.$store.state.ls.targetLayer
        commit('setLoading', true)
        console.time('xy')
        if (targetLayer.object) if (targetLayer.object.type === 'Point') await this.drawSelectedXY(depthDir, x, y)
        commit('setLoading', false)
        console.timeEnd('xy')
      },

      async drawSelectedXY(depthDir, x, y) {
        /*
         * @summary - Callback From Depth Select
         */
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
        /*
         * @summary - Callback From Clodu
         */
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
        /*
         * @summary - Reset Selected and Selected Layer
         */
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
        /*
         * @summary - Reset Layer
         */
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
        /*
         * @summary - Reset Snap for New Snap
         */
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
