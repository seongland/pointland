<template>
  <v-container>
    <v-layout row wrap>
      <div id="map" />
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data: function() {
    return {}
  },
  mounted() {
    this.olInit()
  }
}
</script>

<style>
#map {
  height: 50em;
  width: 100%;
}
</style>
