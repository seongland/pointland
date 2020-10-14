import Vue from 'vue'
import { olInit, ref as mapRef } from '~/plugins/map/init'
import { drawXYs, drawXY, subtractVhcl } from './map/draw'
import { initCloud, purgeCloud, ref as cloudRef } from './cloud/init'
import { drawLas, drawXYZ, resetPointLayer } from './cloud/draw'
import { xyto84 } from '~/server/api/addon/tool/coor'
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

      checkMount: () => {
        console.log(mapRef.map, cloudRef.cloud)
        return mapRef.map !== undefined && cloudRef.cloud.offset !== undefined
      },

      setSnap(snapObj) {
        commit('ls/setSnap', snapObj)
        for (const mark of snapObj.marks)
          this.waitAvail(this.checkMount, this.markXYZ, [[mark.x, mark.y, mark.alt], mark.name])
      },

      setMark(markObj) {
        commit('ls/setMark', markObj)
        this.waitAvail(this.checkMount, this.currentXYZ, [[markObj.x, markObj.y, markObj.alt]])
      },

      setLayer: data => commit('setLayer', data),

      async waitAvail(flag, callback, args) {
        console.log(args)
        flag() ? callback(...args) : setTimeout(() => this.waitAvail(flag, callback, args), 500)
      },

      selectXYZ(xyz, id) {
        const lnglat = xyto84(xyz[0], xyz[1])
        const latlng = lnglat.reverse()
        drawXY(mapRef.selectedLayer, latlng, false, id)
        drawXYZ(cloudRef.selectedLayer, xyz, false, id)
      },

      markXYZ(xyz, id) {
        const lnglat = xyto84(xyz[0], xyz[1])
        const latlng = lnglat.reverse()
        drawXY(mapRef.markLayer, latlng, false, id)
        drawXYZ(cloudRef.markLayer, xyz, false, id)
      },

      currentXYZ(xyz) {
        resetPointLayer(cloudRef.currentLayer)
        const lnglat = xyto84(xyz[0], xyz[1])
        const latlng = lnglat.reverse()
        drawXY(mapRef.currentLayer, latlng, true, 'current')
        drawXYZ(cloudRef.currentLayer, xyz, true, 'current')
      },

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
        let seqIndex
        const ls = this.$store.state.ls
        const index = this.$store.state.ls.index
        switch (event.key) {
          // change seq
          case ',':
            seqIndex = ls.currentSnap.marks.indexOf(ls.currentMark)
            if (seqIndex > 0) if (!state.depth.loading) this.setMark(ls.currentSnap.marks[seqIndex - 1])
            return

          case '.':
            seqIndex = ls.currentSnap.marks.indexOf(ls.currentMark)
            if (seqIndex < ls.currentSnap.marks.length - 1)
              if (!state.depth.loading) this.setMark(ls.currentSnap.marks[seqIndex + 1])
            return

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
            return
          case 'm':
            if (index === 0) return
            const mapWrapper = document.getElementById('global-map').parentElement
            if (this.tabs[0].show) mapWrapper.setAttribute('style', 'z-index:-1 !important')
            else mapWrapper.setAttribute('style', 'z-index:5 !important')
            this.tabs[0].show = !this.tabs[0].show
            return
        }
        console.log(event)
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
        this.$root.map = olInit(geoserver, workspace, layers)
        return this.$root.map
      }
    }
  })
}
