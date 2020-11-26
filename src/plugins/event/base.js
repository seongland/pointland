import Vue from 'vue'
import consola from 'consola'
import { clickImage } from '~/modules/image/event'
import { setFocusXYZ } from '~/modules/cloud/event'

export default ({ store: { commit, state, $router } }) => {
  Vue.mixin({
    methods: {
      setRound: round => commit('ls/setRound', round),
      setRounds: rounds => commit('ls/setRounds', rounds),

      clickMark(_, feature) {
        /*
         * @summary - Map Click Mark Callback
         */
        if (feature) {
          const markId = feature.getId()
          for (const markObj of state.ls.currentSnap.marks) if (markObj.name === markId) this.setMark(markObj)
        }
      },

      clickProcessed(_, feature) {
        /*
         * @summary - Map Click Processed geoserver mark
         */
        const roundName = feature.get('round')
        const snapName = feature.get('snap')
        const markName = feature.get('name')
        if (process.env.dev) consola.info('Click', roundName, snapName, markName)
        for (const roundObj of state.ls.rounds)
          if (roundObj.name === roundName) this.setRound({ ...roundObj, snap: snapName, mark: markName })
      },

      async resetSnap() {
        /*
         * @summary - Reset Snap for New Snap
         */
        const cloud = cloudRef.cloud
        if (mapRef.markLayer) mapRef.markLayer.getSource().clear()
        if (mapRef.markLayer) mapRef.drawnLayer.getSource().clear()
        if (cloudRef.markLayer) resetPointLayer(cloudRef.markLayer)
        if (cloudRef.markLayer) resetPointLayer(cloudRef.drawnLayer)
        if (cloud.points) for (const pointLayer of cloud.points) cloud.scene.remove(pointLayer)
        cloud.points = []
      },
      async setSnap(snapObj) {
        /*
         * @summary - Set Snap
         */
        commit('setLoading', true)
        snapObj.round = state.ls.currentRound.name

        // Get Snap Object
        const apiUrl = `/api/meta/${snapObj.round}/${snapObj.name}`
        const config = this.getAuthConfig()
        config.data = { snap: snapObj }
        const snapRes = await this.$axios.post(apiUrl, config)
        snapObj.areas = snapRes.data.areas
        snapObj.marks = snapRes.data.marks
        const previous = state.ls.currentSnap

        // Check Previous
        if (previous && !(snapObj.name === previous.name && previous.round === snapObj.round)) await this.resetSnap()
        commit('ls/setSnap', snapObj)
        for (const mark of snapObj.marks)
          this.waitAvail(this.checkMount, this.markXYZ, [[mark.x, mark.y, mark.alt], mark.name])

        const currentMark = state.ls.currentMark
        this.waitAvail(this.checkMount, setFocusXYZ, [[currentMark.x, currentMark.y, currentMark.alt]])
      },

      setMark(markObj) {
        /*
         * @summary - Set Mark
         */
        commit('ls/setMark', markObj)
        this.waitAvail(this.checkMount, this.currentXYZ, [[markObj.x, markObj.y, markObj.alt]])
      },

      async clickImage(event, depth) {
        return clickImage(event, depth, this.drawFromDepth, this.selectFromDepth)
      }
    }
  })
}
