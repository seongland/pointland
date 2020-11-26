import Vue from 'vue'
import { olInit, ref as mapRef } from '~/plugins/map/init'
import { initCloud, purgeCloud, ref as cloudRef } from './cloud/init'
import { initImg, ref as imgRef } from './image/init'

export default ({ $axios, store: { commit, state } }) => {
  Vue.mixin({
    methods: {
      purgeCloud: () => purgeCloud(),
      checkMount: () => mapRef.map !== undefined && cloudRef.cloud.offset !== undefined,
      getAuthConfig: () => ({ headers: { Authorization: state.ls.accessToken } }),
      async waitAvail(flag, callback, args) {
        /*
         * @summary - Wait for mount template function
         */
        flag() ? callback(...args) : setTimeout(() => this.waitAvail(flag, callback, args), 1000)
      },

      olInit(opt, geoserver, workspace, layers) {
        // Set Map Callback
        this.$root.mapRef = mapRef

        opt.callback.moveend = this.mapMoveEnd
        for (const config of this.mapOpt.layers.vector) {
          if (config.name === 'markLayer') config.callback.click = this.clickMark
          else if (config.name === 'drawnLayer') config.callback.click = this.clickDrawn
        }
        for (const config of this.mapOpt.layers.geoserver) {
          if (config.name === 'processedLayer') config.callback.click = this.clickProcessed
        }
        this.$root.map = olInit(opt, geoserver, workspace, layers)
        return this.$root.map
      },

      initCloud(option) {
        this.$root.cloudRef = cloudRef

        // Set Cloud Callback
        for (const layerOpt of option.pointLayers)
          if (layerOpt.name === 'markLayer') {
            // Mark 3D Click Callback
            layerOpt.callback.click = (_, intersect) => {
              let name = intersect.object.geometry.indexes[intersect.index].id
              for (const markObj of state.ls.currentSnap.marks) if (markObj.name === name) this.setMark(markObj)
            }
          } else if (layerOpt.name === 'drawnLayer') {
            // Facility 3D Click Callback
            layerOpt.callback.click = async (event, intersect) => {
              let id, index, index2
              let vid = intersect.object.geometry.indexes[intersect.index].id
              const idSet = vid.split(this.idSep)
              id = vid
              if (idSet.length > 1) {
                id = idSet[0]
                index = idSet[1]
                index2 = idSet[2]
              }
              commit('setLoading', true)
              await this.selectID(id, index, index2, event)
              commit('setLoading', false)
            }
          }
        option.selectCallback = (event, xyz) => {
          const targetLayer = this.$store.state.ls.targetLayer
          if (targetLayer.object) if (targetLayer.object.type === 'Point') this.newFacilityByXYZ(xyz, event)
        }

        const cloud = initCloud(option)
        const transform = cloud.transform
        transform.removeEventListener('dragging-changed', this.dragSelected)
        transform.addEventListener('dragging-changed', this.dragSelected)
        window.addEventListener('keyup', event => [(window.ctrlKey = event.ctrlKey), (window.shiftKey = event.shiftKey)])
      },

      mapMoveEnd() {
        if (state.edit.ing || state.submit.ing) return
        this.drawnFacilities()
      },

      async reloadUser() {
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
        window.removeEventListener('keydown', this.keyEvent)
        window.addEventListener('keydown', this.keyEvent)
        window.removeEventListener('keyup', this.keyUp)
        window.addEventListener('keyup', this.keyUp)

        document.addEventListener('contextmenu', event => event.preventDefault())
      },

      async loadProjects(user, accessToken) {
        const projectPromises = []
        const config = { headers: { Authorization: accessToken } }
        for (const i in user.projects) projectPromises.push($axios.get(`/api/projects?id=${user.projects[i].id}`, config))
        const projectResponses = await Promise.all(projectPromises)
        user.projects = projectResponses.map(res => res.data[0])
      },

      initImg({ front, back }) {
        this.$root.imgRef = imgRef
        return initImg({ front, back })
      }
    }
  })
}
