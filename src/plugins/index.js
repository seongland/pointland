import Vue from 'vue'
import { olInit } from '~/plugins/map/meta'
import { drawXYs, drawXY, subtractVhcl } from "./map/draw"
import { changeLayers } from "./map/layer"

export default ({ store, $axios }) => {
  Vue.mixin({
    data: () => {
      return {
        map: undefined
      }
    },
    methods: {
      drawXYs: (data, id) => drawXYs(data, id),
      subtractVhcl: (id) => subtractVhcl(id),
      drawXY: (data, focus, id) => drawXY(data, focus, id),

      async loadProjects(user, accessToken) {
        const projectPromises = []
        const config = { headers: { Authorization: accessToken } }
        for (const i in user.projects)
          projectPromises.push(this.$axios.get(
            `/api/projects?id=${user.projects[i].id}`,
            config
          ))
        const projectResponses = await Promise.all(projectPromises)
        user.projects = projectResponses.map(res => res.data[0])
      },

      olInit(geoserver, workspace, layers) {
        this.map = olInit(geoserver, workspace, layers)
        return this.map
      },

      waitAvail(flag, callback, args) {
        this.$nextTick(
          () => flag() ? callback(...args) : this.waitAvail(flag, callback, args)
        )
      }
    }
  })
  if (process.client) {
    const origin = window.location.origin
    $axios.defaults.baseURL = origin
  }
}
