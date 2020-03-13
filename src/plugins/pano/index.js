import Vue from 'vue'
import { stpanoInit } from '~/plugins/pano/modules/init.js'

Vue.mixin({
  methods: {
    async stpanoInit(map) {
      return await stpanoInit(map)
    }
  }
})
