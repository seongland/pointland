<template>
  <div id="las"></div>
</template>

<script>
import proj4 from 'proj4'
import { WGS84, EPSG32652 } from '~/server/api/addon/node/const'

export default {
  async fetch() {
    const commit = this.$store.commit
    const fetch = this.$axios
    for (const index of [8, 9, 10]) {
      const root = `/api/pointcloud/imms_20200824_193802/snap1/${index}`
      const check = await fetch(`${root}`)
      if (check.data.cached) {
        const promises = [fetch(`${root}/x`), fetch(`${root}/y`), fetch(`${root}/z`), fetch(`${root}/c`), fetch(`${root}/i`)]
        const [x, y, z, c, i] = await Promise.all(promises)
        const params = [{ x: x.data, y: y.data, z: z.data, center: c.data, intensity: i.data }]
        commit('load', { func: this.drawLas, params })
      } else commit('load', { func: this.drawLas, params: check.data })
    }
  },

  mounted() {
    this.$root.cloud = this.initCloud({
      selectCallback: (xyz, point) => {
        const lnglat = proj4(EPSG32652, WGS84, [xyz[0], xyz[1]])
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
