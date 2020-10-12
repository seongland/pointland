import Vue from 'vue'
import { olInit } from '~/plugins/map/meta'
import { drawXYs, drawXY, subtractVhcl } from './map/draw'
import { initCloud, purgeCloud } from './cloud/meta'
import { drawLas } from './cloud/draw'
import AsyncComputed from 'vue-async-computed'

Vue.use(AsyncComputed)

export default ({ $axios, store: { commit, state } }) => {
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

      eventBind() {
        // Register Map event for tab change
        const mapWrapper = document.getElementById('global-map').parentElement
        if (this.index !== 0) mapWrapper.classList.add('small-map')
        setTimeout(() => window.dispatchEvent(new Event('resize')))

        // Keyboard
        window.removeEventListener('keypress', this.keyEvent)
        window.addEventListener('keypress', this.keyEvent)
      },

      async reloadUser() {
        this.meta.version = process.env.version
        const ls = this.$store.state.ls
        const accessToken = ls.accessToken
        const config = { headers: { Authorization: accessToken } }
        const res = await this.$axios.get(`/api/user?id=${ls.user.id}`, config)
        const user = res?.data[0]
        await this.loadProjects(user, accessToken)
        commit('ls/login', { accessToken, user })
      },

      keyEvent(event) {
        const index = this.$store.state.ls.index
        console.log(event)
        switch (event.key) {
          // change seq
          case ',':
            if (!state.depth.loading) return commit('ls/setSeq', state.ls.currentSeq - 1)
          case '.':
            if (!state.depth.loading) return commit('ls/setSeq', state.ls.currentSeq + 1)

          // change tabs
          case '1':
            return commit('ls/setIndex', Number(event.key) - 1)
          case '2':
            return commit('ls/setIndex', Number(event.key) - 1)
          case '3':
            return commit('ls/setIndex', Number(event.key) - 1)

          // Toggle
          case 'd':
            if (index === 1) return commit('toggleDepth')
          case 'm':
            if (index === 0) return
            const mapWrapper = document.getElementById('global-map').parentElement
            if (this.tabs[0].show) mapWrapper.setAttribute('style', 'z-index:-1 !important')
            else mapWrapper.setAttribute('style', 'z-index:5 !important')
            this.tabs[0].show = !this.tabs[0].show
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
        layers = { tiff: 'testiff' }
        this.map = olInit(geoserver, workspace, layers)
        return this.map
      }
    }
  })
}
