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
        const cloud = cloudRef.cloud
        const lnglat = xyto84(xyz[0], xyz[1])
        const latlng = lnglat.reverse()
        drawXY(mapRef.selectedLayer, latlng, false, id)

        const transform = cloud.transform
        transform.position.x = xyz[0] - cloud.offset[0]
        transform.position.y = xyz[1] - cloud.offset[1]
        transform.position.z = xyz[2] - cloud.offset[2]
        const pos = transform.position

        const divider = Math.abs(pos.x) + Math.abs(pos.y) + Math.abs(pos.z)
        let factor = 3 / divider
        if (factor > 0.2) factor = 0.2
        transform.setSize(factor)

        transform.attach(cloudRef.selectedLayer)
        transform.visible = state.visible.transform
        transform.enabled = state.visible.transform

        const object = cloudRef.selectedLayer
        object.updateMatrix()
        object.geometry.applyMatrix4(object.matrix)
        object.position.set(0, 0, 0)
        object.updateMatrix()

        drawXYZ(cloudRef.selectedLayer, xyz, false, id)
      },

      async drawnFacilities(currentMark, layer) {
        /*
         * @summary - Get & Draw drawn Facilities
         */
        let facilities
        if (!currentMark) currentMark = state.ls.currentMark
        if (!imgRef.drawnLayer) return
        if (!layer) layer = state.ls.targetLayer?.object?.layer
        const box = this.getExtentBox()

        // get Facilities
        if (layer) {
          let url = `/api/facility/box/${layer}`
          const res = await $axios.post(url, { box })
          facilities = res.data
        } else facilities = []

        // Reset
        await this.resetLayer('drawnLayer')
        resetPointLayer(cloudRef.drawnLayer)
        removeLineLoops()

        // Filter Facility
        const task = state.ls.targetTask
        let filteredFacilities = facilities
        if (task) filteredFacilities = filteredFacilities.filter(item => item.relations[task.prop] === task.data)
        commit('setState', { props: ['facilities'], value: filteredFacilities })

        // Draw to Image
        await this.drawToImage(filteredFacilities, currentMark, imgRef.drawnLayer)
        updateImg(imgRef.drawnLayer)

        // Draw to Map and Cloud
        this.drawGeojsons(filteredFacilities, 'drawnLayer')
      },

      drawGeojsons(geojsons, layer) {
        const [xyzs, ids] = [[], []]
        for (const geojson of geojsons) {
          const props = geojson.properties
          const geom = geojson.geometry

          if (geom.type === 'Point') {
            xyzs.push([props.x, props.y, props.z])
            ids.push(geojson.id)
          } else if (geom.type === 'LineString') {
            for (const index in props.xyzs) {
              const xyz = props.xyzs[index]
              xyzs.push(xyz)
              let id = geojson.id + this.idSep + index
              ids.push(id)
            }
          } else if (geom.type === 'Polygon') {
            for (const index in props.xyzs) {
              const polyline = props.xyzs[index]
              for (const index2 in polyline) {
                const xyz = polyline[index2]
                xyzs.push(xyz)
                let id = geojson.id + this.idSep + index + this.idSep + index2
                ids.push(id)
              }
            }
          }
          // Main Feature to Cloud, Map
          if (geom.type !== 'Point') {
            const projection = { dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857' }
            const feature = new GeoJSON(projection).readFeature(geojson)
            mapRef[layer].getSource().addFeature(feature)
            if (geom.type === 'LineString') drawLine(props.xyzs, layer)
            else if (geom.type === 'Polygon') drawLoop(props.xyzs, layer)
          }
        }
        this.drawXYZPoints(xyzs, ids, layer)
      },

      async drawRelated(id) {
        const facility = await this.getFacilityByID(id)
        if (facility) this.drawGeojsons([facility], 'relatedLayer')
      },

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
      },

      async newFacilityByXY(depthDir, x, y, event) {
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
        const xyzRes = await $axios.post(`${depthDir.url}/${x}/${y}`)
        const xyz = xyzRes.data
        const round = ls.currentRound.name
        const snap = ls.currentSnap.name
        const direction = depthDir.name
        const coordinates = coordinates
        const imgOpt = [{ round, snap, name, direction, coordinates }]
        commit('select', { xyz, type: 'Point', images: imgOpt })
        this.selectXYZ(xyz, POINT_ID)
      },

      async newFacilityByXYZ(xyz, event) {
        /*
         * @summary - Callback From Clodu
         */
        await this.resetSelected()
        commit('select', {
          xyz,
          type: 'Point'
        })
        this.selectXYZ(xyz, POINT_ID)
        await this.drawToImage(state.selected, state.ls.currentMark, imgRef.selectedLayer)
        updateImg(imgRef.selectedLayer)
      },

      async resetSelected() {
        /*
         * @summary - Reset Selected and Selected Layer
         */

        commit('setLoading', true)
        // map
        mapRef.selectedLayer.getSource().clear()
        mapRef.relatedLayer.getSource().clear()

        // cloud
        resetPointLayer(cloudRef.selectedLayer)
        resetPointLayer(cloudRef.relatedLayer)

        // Related
        const cloud = cloudRef.cloud
        const trash = { lines: [], loops: [] }
        for (const line of cloud.lines) if (line.layer === 'relatedLayer') trash.lines.push(line)
        for (const loop of cloud.loops) if (loop.layer === 'relatedLayer') trash.loops.push(loop)
        for (const shapeName of Object.keys(trash))
          for (const shape of trash[shapeName]) {
            cloud.scene.remove(shape)
            const index = cloud[shapeName].indexOf(shape)
            cloud[shapeName].splice(index, 1)
          }

        //image
        const depth = imgRef.depth
        if (depth)
          for (const data of Object.values(depth)) {
            data.layer.selected.image = new jimp(data.width, data.height)
            const uri = await data.layer.selected.image.getBase64Async('image/png')
            data.layer.selected.uri = uri
          }
        commit('resetSelected')
        commit('setLoading', false)
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
        if (process.env.dev) consola.success(`Reset ${name}`)
      }
    }
  })
}
