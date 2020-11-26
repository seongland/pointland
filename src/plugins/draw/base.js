/*
 * @summary - vue draw plugin
 */

import Vue from 'vue'
import { ref as mapRef } from '~/modules/map/init'
import { ref as imgRef } from '~/modules/image/init'
import { ref as cloudRef } from '~/modules/cloud/init'

import { drawXY } from '../../modules/map/draw'
import { drawLas, drawXYZ } from '~/modules/cloud/draw'
import { resetPointLayer } from '~/modules/cloud/event'
import { xyto84 } from '~/server/api/addon/tool/coor'
import { transform } from 'ol/proj'
import jimp from 'jimp/browser/lib/jimp'
import consola from 'consola'

export default ({}) => {
  Vue.mixin({
    methods: {
      drawLas: (lasJson, name) => drawLas(lasJson, name),

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

      drawXYZPoint(xyz, id, layer) {
        const lnglat = xyto84(xyz[0], xyz[1])
        const latlng = lnglat.reverse()
        drawXY(mapRef[layer], latlng, false, id)
        drawXYZ(cloudRef[layer], xyz, false, id)
      },

      drawXYZPoints(xyzs, ids, layer) {
        for (const index in xyzs) this.drawXYZPoint(xyzs[index], ids[index], layer)
      },

      getExtentBox() {
        const extent = mapRef.map.getView().calculateExtent()
        const leftBottom = transform(extent.slice(0, 2), 'EPSG:3857', 'EPSG:4326')
        const rightTop = transform(extent.slice(2, 4), 'EPSG:3857', 'EPSG:4326')
        return [leftBottom, rightTop]
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
