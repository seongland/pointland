import Vue from 'vue'
import { olInit } from '~/plugins/map/modules/meta'

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