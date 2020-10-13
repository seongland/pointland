<template>
  <div id="las" />
</template>

<script>
import proj4 from 'proj4'
import { xyto84 } from '~/server/api/addon/tool/coor'

export default {
  data: () => ({ loading: false }),
  async fetch() {
    const commit = this.$store.commit
    const fetch = this.$axios
    const currentRound = this.$store.state.ls.currentRound.name
    const currentSnap = this.$store.state.ls.currentSnap.name
    for (const index of []) {
      const root = `/api/pointcloud/${currentRound}/${currentSnap}/${index}`
      const check = await fetch(`${root}`)
      commit('setLoading', true)
      if (check.data.cached) {
        const promises = [fetch(`${root}/x`), fetch(`${root}/y`), fetch(`${root}/z`), fetch(`${root}/c`), fetch(`${root}/i`)]
        const [x, y, z, c, i] = await Promise.all(promises)
        this.drawLas({ x: x.data, y: y.data, z: z.data, center: c.data, intensity: i.data })
      } else this.drawLas(check.data)
      commit('setLoading', false)
    }
  },

  mounted() {
    this.$root.cloud = this.initCloud({
      selectCallback: (xyz, point) => {
        const lnglat = xyto84(xyz[0], xyz[1])
        const latlng = [lnglat[1], lnglat[0]]
        this.drawXY(latlng, true, latlng[0])
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
