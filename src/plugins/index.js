import Vue from 'vue'
import { olInit } from '~/plugins/map/meta'

Vue.mixin({
  data : () => {
    return {
      stMap: undefined
    }
  },
  methods: {
     olInit() {
      this.stMap = olInit()
      
      return this.stMap
    }
  }
})