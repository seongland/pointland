<template>
  <v-layout row wrap align-center>
    <v-flex xs12 sm12 md12>
      <v-container>
        <v-card>
          <geo-map />
          <v-card-title>
            GeoMap
          </v-card-title>
        </v-card>
      </v-container>
    </v-flex>
  </v-layout>
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
