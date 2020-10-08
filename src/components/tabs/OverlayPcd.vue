<template>
  <div id="las"></div>
</template>

<script>
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
    this.$root.cloud = this.initCloud()
  }
}
</script>

<style>
#las {
  height: 100%;
}
</style>
