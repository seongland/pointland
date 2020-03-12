<template>
  <v-container>
    <v-layout row wrap>
      <div id="map"></div>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: mapGetters({
    articles: 'articles/get',
    comments: 'articles/comments/get'
  }),
  mounted() {
    this.olInit()
  },

  data: function() {
    return {}
  }
}
</script>

<style>
#map {
  height: 50em;
  width: 100%;
}
</style>
