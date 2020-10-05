import Vue from 'vue'
import { olInit } from '~/plugins/map/meta'
import { drawXYs, drawXY, subtractVhcl } from "./map/draw"
import { initCloud, purgeCloud } from "./cloud/meta"
import { drawLas } from "./cloud/draw"
import AsyncComputed from 'vue-async-computed'

Vue.use(AsyncComputed)

export default ({ $axios }) => {
  Vue.mixin({
    data: () => ({
      title: '3D MAPPING',
      coor: 'Stryx',
      meta: {
        version: undefined
      },
      map: undefined,
      tabs: [
        {
          name: 'Map',
          type: 'map'
        },
        {
          name: 'Image',
          type: 'image'
        },
        {
          name: '3D',
          type: '3d'
        }
      ]
    }),
    methods: {
      initCloud: () => initCloud(),
      purgeCloud: () => purgeCloud(),
      drawLas: (lasJson) => drawLas(lasJson),
      drawXYs: (data, id) => drawXYs(data, id),
      subtractVhcl: (id) => subtractVhcl(id),
      drawXY: (data, focus, id) => drawXY(data, focus, id),

      changeRound(round) {
        this.$store.commit('ls/changeRound', round)
      },
      changeSnap(snap) {
        this.$store.commit('ls/changeSnap', snap)
      },
      changeSeq(seq) {
        this.$store.commit('ls/changeSeq', seq)
      },

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
