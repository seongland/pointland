<template>
  <v-container>
    <v-layout row wrap>
      <div id="pano" />
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data: function() {
    return {}
  },
  mounted() {
    let stpano = this.stpanoInit()
  }
}
</script>

<style>
#pano {
  height: 50em;
  width: 100%;
}
</style>
