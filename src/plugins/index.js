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
    drawXYs: (data, focus, id) => drawXYs(data, focus, id),
    drawXY: (data, focus, id) => drawXY(data, focus, id),

    olInit() {
      this.map = olInit()
      return this.map
    }
  }
})