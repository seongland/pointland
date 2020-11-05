import Vue from 'vue'
import { olInit } from '~/plugins/map/init'
import { initCloud, purgeCloud } from './cloud/init'
import { initImg } from './image/init'

export default ({ $axios, store: { commit } }) => {
  Vue.mixin({
    methods: {
      purgeCloud: () => purgeCloud(),

      initCloud(option) {
        const cloud = initCloud(option)
        const transform = cloud.transform
        transform.removeEventListener('dragging-changed', this.dragSelected)
        transform.addEventListener('dragging-changed', this.dragSelected)
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

      eventBind() {
        // Register Map event for tab change
        const mapWrapper = document.getElementById('global-map')?.parentElement
        if (!mapWrapper) return
        if (this.index !== 0) mapWrapper.classList.add('small-map')
        setTimeout(() => window.dispatchEvent(new Event('resize')))

        // Keyboard
        window.removeEventListener('keypress', this.keyEvent)
        window.addEventListener('keypress', this.keyEvent)
        window.removeEventListener('keyup', this.keyUp)
        window.addEventListener('keyup', this.keyUp)
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
        for (const config of this.mapOpt.layers.vector) {
          config.callback = {}
          if (config.name === 'markLayer') config.callback.click = this.clickMark
          else if (config.name === 'drawnLayer') config.callback.click = this.clickDrawn
        }
        for (const config of this.mapOpt.layers.geoserver) {
          config.callback = {}
          if (config.name === 'processedLayer') config.callback.click = this.clickProcessed
        }
        this.$root.map = olInit(opt, geoserver, workspace, layers)
        return this.$root.map
      },

      initImg: ({ front, back }) => initImg({ front, back })
    }
  })
}
