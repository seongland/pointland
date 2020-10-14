<template>
  <div id="las" />
</template>

<script>
import { xyto84 } from '~/server/api/addon/tool/coor'
import { v4 as uuid } from 'uuid'

export default {
  data: () => ({
    lasList: [],
    loading: false
  }),

  computed: {
    currentMark() {
      return this.$store.state.ls.currentMark
    }
  },
  watch: {
    async currentMark(markObj) {
      const commit = this.$store.commit
      const fetch = this.$axios
      const ls = this.$store.state.ls
      const root = escape(`/api/image/${ls.currentRound.name}/${ls.currentSnap.name}/${ls.currentMark.name}`)
      const res = await fetch.post(`${root}/las`, { data: { mark: markObj } })
      const currentRound = this.$store.state.ls.currentRound.name
      const currentSnap = this.$store.state.ls.currentSnap.name
      const lasList = res.data
      commit('setLoading', true)
      commit('setLoading', false)

      for (const areaName of lasList) {
        if (this.lasList.includes(areaName)) return
        this.lasList.push(areaName)
        if (process.env.dev) console.log('New Area', areaName)
        const root = `/api/pointcloud/${currentRound}/${currentSnap}/${areaName}`
        const check = await fetch(`${root}`)
        commit('setLoading', true)
        if (check.data.cached) {
          const promises = [fetch(`${root}/x`), fetch(`${root}/y`), fetch(`${root}/z`), fetch(`${root}/c`), fetch(`${root}/i`)]
          const [x, y, z, c, i] = await Promise.all(promises)
          this.drawLas({ x: x.data, y: y.data, z: z.data, center: c.data, intensity: i.data })
        } else this.drawLas(check.data)
        commit('setLoading', false)
      }
    }
  },

  async fetch() {},

  mounted() {
    this.$root.cloud = this.initCloud({
      selectCallback: (xyz, point) => {
        this.clickXYZ(xyz, true, uuid())
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
