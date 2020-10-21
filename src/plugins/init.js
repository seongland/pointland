import Vue from 'vue'
import { olInit, setClickCB } from '~/plugins/map/init'
import { initCloud, purgeCloud } from './cloud/init'

export default ({ $axios, store: { commit } }) => {
  Vue.mixin({
    methods: {
      initCloud: option => initCloud(option),
      purgeCloud: () => purgeCloud(),

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

      eventBind() {
        // Register Map event for tab change
        const mapWrapper = document.getElementById('global-map')?.parentElement
        if (!mapWrapper) return
        if (this.index !== 0) mapWrapper.classList.add('small-map')
        setTimeout(() => window.dispatchEvent(new Event('resize')))

        // Keyboard
        window.removeEventListener('keypress', this.keyEvent)
        window.addEventListener('keypress', this.keyEvent)
      },

      async loadProjects(user, accessToken) {
        const projectPromises = []
        const config = { headers: { Authorization: accessToken } }
        for (const i in user.projects)
          projectPromises.push($axios.get(`${process.env.twr}/api/projects?id=${user.projects[i].id}`, config))
        const projectResponses = await Promise.all(projectPromises)
        user.projects = projectResponses.map(res => res.data[0])
      },

      olInit(opt, geoserver, workspace, layers) {
        this.$root.map = olInit(opt, geoserver, workspace, layers)
        setClickCB(this.clickMark)
        return this.$root.map
      }
    }
  })
}
