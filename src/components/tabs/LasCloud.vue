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
      const lasList = markObj.lasList.split(':')
      for (const areaName of lasList) {
        if (this.lasList.includes(areaName)) continue
        this.lasList.push(areaName)
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
      if (process.env.dev) console.log('New Area', areaName)
      const root = `/api/pointcloud/${currentRound}/${currentSnap}/${areaName}`
      const check = await fetch(`${root}`)
      if (check.data.cached) {
        const promises = [fetch(`${root}/x`), fetch(`${root}/y`), fetch(`${root}/z`), fetch(`${root}/c`), fetch(`${root}/i`)]
        const [x, y, z, c, i] = await Promise.all(promises)
        commit('setLoading', true)
        setTimeout(() => {
          this.drawLas({ x: x.data, y: y.data, z: z.data, center: c.data, intensity: i.data })
          commit('setLoading', false)
        })
      } else {
        commit('setLoading', true)
        setTimeout(() => {
          this.drawLas(check.data)
          commit('setLoading', false)
        })
      }
    }
  },

  async fetch() {},

  mounted() {
    this.$root.cloud = this.initCloud({
      selectCallback: (xyz, point) => {
        this.selectXYZ(xyz, uuid())
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
