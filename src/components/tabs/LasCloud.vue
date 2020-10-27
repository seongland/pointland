/* * @summary - vue point cloud component */

<template>
  <div>
    <!-- <v-toolbar class="pt-3 px-3" color="grey darken-4" dense>
      <v-slider label="X" :value="0" :max="1" :min="-1" step="0.005" />
      <v-slider label="Y" :value="0" :max="1" :min="-1" step="0.005" />
      <v-slider label="Z" :value="0" :max="1" :min="-1" step="0.005" />
    </v-toolbar> -->
    <div id="las" />
  </div>
</template>

<script>
import { xyto84 } from '~/server/api/addon/tool/coor'
import { ref } from '~/plugins/cloud/init'
import { v4 as uuid } from 'uuid'

export default {
  data: () => ({
    lasList: [],
    apiList: [],
    loading: false
  }),

  computed: {
    currentMark() {
      return this.$store.state.ls.currentMark
    }
  },
  watch: {
    async currentMark(markObj) {
      for (const api of this.apiList) for (const src of api) src.cancel()
      this.apiList = []

      const commit = this.$store.commit
      if (!markObj?.lasList) return
      const lasList = markObj.lasList.split(':')
      const mainIndex = lasList.indexOf(markObj.mainArea)
      const loadList = [mainIndex, mainIndex - 1, mainIndex + 1, mainIndex + 2, mainIndex - 2]

      // Make remove List
      const removeList = []
      for (const las of this.lasList) if (!lasList.includes(las)) removeList.push(las)

      // Remove Las
      for (const las of removeList) {
        if (process.env.dev) console.log('Remove Area', las)
        for (const i in ref.cloud.points)
          if (ref.cloud.points[i].name === las) {
            ref.cloud.scene.remove(ref.cloud.points[i])
            ref.cloud.points.splice(i, 1)
            break
          }
        this.lasList.splice(this.lasList.indexOf(las), 1)
      }

      // load New las
      for (const index of loadList) {
        if (!lasList[index]) continue
        const areaName = lasList[index]
        if (this.lasList.includes(areaName)) continue
        this.loadLas(areaName)
      }
    }
  },

  methods: {
    async loadLas(areaName) {
      const ls = this.$store.state.ls
      const currentRound = ls.currentRound.name
      const currentSnap = ls.currentSnap.name
      const commit = this.$store.commit
      const fetch = this.$axios
      const fileExt = areaName.split('.').pop()
      if (fileExt !== 'las') return

      const root = `/api/pointcloud/${currentRound}/${currentSnap}/${areaName}`
      const check = await fetch(`${root}`)

      if (check.data.cached) {
        // Make Cancel token
        const xsrc = this.$axios.CancelToken.source()
        const ysrc = this.$axios.CancelToken.source()
        const zsrc = this.$axios.CancelToken.source()
        const csrc = this.$axios.CancelToken.source()
        const isrc = this.$axios.CancelToken.source()
        const promises = [
          fetch(`${root}/x`, {
            cancelToken: xsrc.token
          }),
          fetch(`${root}/y`, {
            cancelToken: ysrc.token
          }),
          fetch(`${root}/z`, {
            cancelToken: zsrc.token
          }),
          fetch(`${root}/c`, {
            cancelToken: csrc.token
          }),
          fetch(`${root}/i`, {
            cancelToken: isrc.token
          })
        ]
        const srcList = [xsrc, ysrc, zsrc, csrc, isrc]
        this.apiList.push(srcList)

        // Draw
        try {
          const [x, y, z, c, i] = await Promise.all(promises)
          commit('setLoading', true)
          setTimeout(() => {
            this.drawLas({ x: x.data, y: y.data, z: z.data, center: c.data, intensity: i.data }, areaName)
            commit('setLoading', false)
          })
        } catch {
          return
        }
      } else {
        commit('setLoading', true)
        setTimeout(() => {
          this.drawLas(check.data, areaName)
          commit('setLoading', false)
        })
      }
      if (process.env.dev) console.log('New Area', areaName)
      this.lasList.push(areaName)
    }
  },

  async fetch() {},

  mounted() {
    this.$root.cloud = this.initCloud({
      selectCallback: (xyz, point) => {
        const targetLayer = this.$store.state.targetLayer
        if (targetLayer.object)
          if (targetLayer.object.type === 'Point') {
            this.drawSelectedXYZ(xyz)
          }
      }
    })
  },
  fetchOnServer: false
}
</script>

<style>
#las {
  height: 100%;
}
</style>
