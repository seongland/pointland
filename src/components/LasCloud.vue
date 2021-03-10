/* * @summary - vue point cloud componen */

<template>
  <div>
    <div id="las" />
  </div>
</template>

<script>
import consola from 'consola'

export default {
  data: () => ({ lasList: [], apiList: [], loading: false }),

  computed: {},

  watch: {},

  methods: {},

  mounted() {
    this.$root.cloud = this.initCloud(this.cloudOpt)
    if (process.env.dev) consola.info(this.$root.cloud)
  }
}
</script>

<style>
#las {
  height: 100%;
}
</style>
