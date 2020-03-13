import Vue from 'vue'
import { GeoJSON } from 'ol/format'

import { PVR_URL } from '~/plugins/map/modules/const.js'
import { pvrIdFilter } from '~/plugins/map/modules/filter.js'
import { olInit, getDrawLayer } from '~/plugins/map/modules/meta.js'

Vue.mixin({
  methods: {
    async olInit() {
      return await olInit()
    },

    changeFeaturebyID(pvrid, map) {
      let drawLayer = getDrawLayer(map)
      fetch(PVR_URL + pvrIdFilter(pvrid), { method: 'GET', mode: 'cors' })
        .then(response => {
          return response.json()
        })
        .then(json => {
          let features = new GeoJSON().readFeatures(json)
          if (features.length === 0) return alert('No Feature In Geoserver')
          let feature = features[0]
          this.drawSelect(feature, drawLayer)
          // stpano.AvatarMove({
          // nodeid: pvrid
          // })
        })
    }
  }
})
