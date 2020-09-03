import Vue from 'vue'
import { olInit } from '~/plugins/map/meta'
import { drawXYs, drawXY } from "./map/draw"
import { changeLayers } from "./map/layer"

Vue.mixin({
  data: () => {
    return {
      map: undefined
    }
  },
  methods: {
    drawXYs: (data, id) => drawXYs(data, id),
    drawXY: (data, focus, id) => drawXY(data, focus, id),
    changeProject: (prj, projects) => {
      for (const project of projects)
        if (project.name === prj)
          changeLayers(project.geoserver, project.workspace, project.layers)
    },

    olInit(geoserver, workspace, layers) {
      this.map = olInit(geoserver, workspace, layers)
      return this.map
    }
  }
})

export default function ({ $axios }) {
  if (process.client) {
    const origin = window.location.origin
    $axios.defaults.baseURL = origin
  }
}
