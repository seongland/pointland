<template>
  <div id="las"></div>
</template>

<script>
export default {
  data: () => ({
    pointSize: 0.05
  }),
  async fetch() {
    for (const i of [1, 2, 3, 4, 5, 6,  7, 8, 9, 10, 11, 12]) {
      const lasData = await this.$axios(
        `/api/pointcloud/imms_20200824_193802/snap1/${i}`
      )
      console.log(lasData)
      this.drawLas(lasData.data)
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
