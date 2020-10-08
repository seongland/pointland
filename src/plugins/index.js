import Vue from 'vue'
import { olInit } from '~/plugins/map/meta'
import { drawXYs, drawXY, subtractVhcl } from './map/draw'
import { initCloud, purgeCloud } from './cloud/meta'
import { drawLas } from './cloud/draw'
import AsyncComputed from 'vue-async-computed'

Vue.use(AsyncComputed)

export default ({ $axios, store: { commit } }) => {
  if (process.client) {
    const origin = window.location.origin
    $axios.defaults.baseURL = origin
  }

  Vue.mixin({
    data: () => ({
      title: '3D MAPPING',
      coor: 'Stryx',
      meta: { version: undefined },
      map: undefined,
      tabs: [
        { name: 'Map', type: 'map' },
        { name: 'Image', type: 'image' },
        { name: '3D', type: '3d' }
      ]
    }),

    methods: {
      initCloud: () => initCloud(),
      purgeCloud: () => purgeCloud(),
      drawLas: lasJson => drawLas(lasJson),
      drawXYs: (latlngs, id) => drawXYs(latlngs, id),
      subtractVhcl: id => subtractVhcl(id),
      setRound: round => commit('ls/setRound', round),
      setSnap: snap => commit('ls/setSnap', snap),
      setSeq: seq => commit('ls/setSeq', seq),
      setLayer: data => commit('setLayer', data),
      drawXY: (latlng, focus, id) => drawXY(latlng, focus, id),

      async loadProjects(user, accessToken) {
        const projectPromises = []
        const config = { headers: { Authorization: accessToken } }
        for (const i in user.projects)
          projectPromises.push($axios.get(`${process.env.twr}/api/projects?id=${user.projects[i].id}`, config))
        const projectResponses = await Promise.all(projectPromises)
        user.projects = projectResponses.map(res => res.data[0])
      },

      olInit(geoserver, workspace, layers) {
        layers = {
          tiff: 'testiff'
        }
        this.map = olInit(geoserver, workspace, layers)
        return this.map
      },

      waitAvail(flag, callback, args) {
        this.$nextTick(() => (flag() ? callback(...args) : this.waitAvail(flag, callback, args)))
      }
    }
  })
}
