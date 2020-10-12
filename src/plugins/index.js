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
        { name: 'Map', type: 'map', show: true },
        { name: 'Image', type: 'image' },
        { name: 'Cloud', type: 'cloud' }
      ]
    }),

    methods: {
      initCloud: option => initCloud(option),
      purgeCloud: () => purgeCloud(),
      drawLas: lasJson => drawLas(lasJson),
      drawXYs: (latlngs, id) => drawXYs(latlngs, id),
      subtractVhcl: id => subtractVhcl(id),
      setRound: round => commit('ls/setRound', round),
      setSnap: snap => commit('ls/setSnap', snap),
      setSeq: seq => commit('ls/setSeq', seq),
      setLayer: data => commit('setLayer', data),
      drawXY: (latlng, focus, id) => drawXY(latlng, focus, id),

      keyEvent(event) {
        const commit = this.$store.commit
        const state = this.$store.state
        const index = this.$store.state.ls.index
        console.log(event)
        switch (event.key) {
          case 'd':
            if (index !== 1) return
            this.on = !this.on
            return
          case ',':
            if (this.loading) return
            commit('ls/setSeq', state.ls.currentSeq - 1)
            this.loading = true
            return
          case '.':
            if (this.loading) return
            commit('ls/setSeq', state.ls.currentSeq + 1)
            this.loading = true
            return
          case '1':
            return commit('ls/setIndex', Number(event.key) - 1)
          case '2':
            return commit('ls/setIndex', Number(event.key) - 1)
          case '3':
            return commit('ls/setIndex', Number(event.key) - 1)
          case 'm':
            if (index === 0) return
            const mapWrapper = document.getElementById('global-map').parentElement
            if (this.tabs[0].show) {
              this.tabs[0].show = false
              mapWrapper.setAttribute('style', 'z-index:-1 !important')
            } else {
              this.tabs[0].show = true
              mapWrapper.setAttribute('style', 'z-index:5 !important')
            }
            return
        }
      },

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
