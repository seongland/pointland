import Vue from 'vue'
import { olInit } from '~/plugins/map/meta'

Vue.mixin({
  data: () => {
    return {
      map: undefined
    }
  },
  methods: {
    olInit() {
      this.map = olInit()
      return this.map
    }
  }
})