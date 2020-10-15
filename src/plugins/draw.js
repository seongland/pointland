import Vue from 'vue'
import { ref as mapRef } from '~/plugins/map/init'
import { drawXY } from './map/draw'
import { ref as cloudRef } from './cloud/init'
import { drawLas, drawXYZ } from './cloud/draw'
import { resetPointLayer } from './cloud/event'
import { xyto84 } from '~/server/api/addon/tool/coor'

export default () => {
  Vue.mixin({
    methods: {
      drawLas: lasJson => drawLas(lasJson),

      selectXYZ(xyz, id) {
        const lnglat = xyto84(xyz[0], xyz[1])
        const latlng = lnglat.reverse()
        drawXY(mapRef.selectedLayer, latlng, true, id)
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
      }
    }
  })
}
