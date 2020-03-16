import Vue from 'vue'
import { stPanoInit } from '~/plugins/pano/modules/init'

Vue.mixin({
  data : () => {
    return {
      stPano: undefined
    }
  },
  methods: {
     stPanoInit(map) {
      this.stPano =  stPanoInit(map)
      return this.stPano
    }
  }
})
