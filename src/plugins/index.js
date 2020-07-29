import Vue from 'vue'
import { olInit } from '~/plugins/map/meta'
import { drawXYs, drawXY } from "./map/draw"

Vue.mixin({
  data: () => {
    return {
      map: undefined
    }
  },
  methods: {
    drawXYs: (data, focus) => drawXYs(data, focus),
    drawXY: (data, focus) => drawXY(data, focus),

    olInit() {
      this.map = olInit()
      return this.map
    }
  }
})