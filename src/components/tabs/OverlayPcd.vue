<template>
  <div id="las"></div>
</template>

<script>
export default {
  data: () => ({
    pointSize: 0.05
  }),
  async fetch() {
    for (const index of [22]) {
      console.time('loadlas')
      const root = `/api/pointcloud/imms_20200824_193802/snap1/${index}`
      const xp = this.$axios(`${root}/x`)
      const yp = this.$axios(`${root}/y`)
      const zp = this.$axios(`${root}/z`)
      const cp = this.$axios(`${root}/c`)
      const ip = this.$axios(`${root}/i`)
      const [x, y, z, c, i] = await Promise.all([xp, yp, zp, cp, ip])
      console.timeEnd('loadlas')
      console.log({ x, y, z, c, i })
      this.drawLas({
        x: x.data,
        y: y.data,
        z: z.data,
        center: c.data,
        intensity: i.data
      })
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
