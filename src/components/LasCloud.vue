/* * @summary - vue point cloud componen */

<template>
  <div>
    <div id="nipple" v-if="touchable()" />
    <div id="las" />
  </div>
</template>

<script>
import consola from 'consola'
import nipplejs from 'nipplejs'

export default {
  data: () => ({ lasList: [], apiList: [], loading: false }),

  computed: {},

  watch: {},

  methods: {
    touchable: () => window.orientation !== undefined
  },

  mounted() {
    this.$root.cloud = this.initCloud(this.cloudOpt)
    const zone = document.getElementById('nipple')
    if (!zone) return
    const options = { zone, multitouch: true, maxNumberOfNipples: 2 }
    const manager = nipplejs.create(options)
    return manager
  }
}
</script>

<style>
#las,
#nipple {
  height: 100%;
  width: 100%;
  position: absolute;
}
#nipple {
  z-index: 1;
}
</style>
