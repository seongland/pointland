<template>
  <div id="las"></div>
</template>

<script>
import proj4 from 'proj4'

const EPSG32652 = '+proj=utm +zone=52 +ellps=WGS84 +datum=WGS84 +units=m +no_defs'
const WGS84 = '+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs'

export default {
  data: () => ({
    pointSize: 0.05
  }),
  async fetch() {
    for (const index of [8]) {
      const root = `/api/pointcloud/imms_20200824_193802/snap1/${index}`
      console.time('first')
      const check = await this.$axios(`${root}`)
      if (check.data.cached) {
        console.timeEnd('check')
        console.time('loadlas')
        const xp = this.$axios(`${root}/x`)
        const yp = this.$axios(`${root}/y`)
        const zp = this.$axios(`${root}/z`)
        const cp = this.$axios(`${root}/c`)
        const ip = this.$axios(`${root}/i`)
        const [x, y, z, c, i] = await Promise.all([xp, yp, zp, cp, ip])
        console.timeEnd('loadlas')
        console.time('draw')
        this.drawLas({
          x: x.data,
          y: y.data,
          z: z.data,
          center: c.data,
          intensity: i.data
        })
        console.timeEnd('draw')
      } else this.drawLas(check.data, console.timeEnd('first'))
    }
  },
  fetchOnServer: false,
  mounted() {
    const drawXY = this.drawXY
    const selectCallback = function(xyz, point) {
      const lnglat = proj4(EPSG32652, WGS84, [xyz[0], xyz[1]])
      console.log(lnglat)
      const latlng = [lnglat[1], lnglat[0]]
      console.log(this)
      drawXY(latlng, true, latlng[0])
    }

    this.$root.cloud = this.initCloud({ selectCallback })
  }
}
</script>

<style>
#las {
  height: 100%;
}
</style>
