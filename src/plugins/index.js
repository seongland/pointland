import Vue from 'vue'
import { olInit } from '~/plugins/map/meta'
import { drawXYs, drawXY } from "./map/draw"
import { changeProject } from "./map/layer"

Vue.mixin({
  data: () => {
    return {
      map: undefined
    }
  },
  methods: {
    drawXYs: (data, id) => drawXYs(data, id),
    drawXY: (data, focus, id) => drawXY(data, focus, id),
    changeProject: (project) => changeProject(project),

    olInit() {
      this.map = olInit()
      return this.map
    }
  }
})
