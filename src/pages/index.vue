<template>
  <v-card id="map-card">
    <geo-map />
  </v-card>
</template>

<script>
import GeoMap from '~/components/index/GeoMap.vue'

export default {
  components: {
    GeoMap
  },
  mounted() {
    this.olInit()
  }
}
</script>

<style>
  #map-card{
    height: 100%;
  }
</style>