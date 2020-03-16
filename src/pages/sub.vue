<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs12 sm12 md6>
        <v-container>
          <v-card>
            <geo-table />
          </v-card>
        </v-container>
      </v-flex>

      <v-flex xs12 sm12 md6>
        <v-container>
          <v-card>
            <geo-pano />
          </v-card>
        </v-container>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import GeoMap from '~/components/index/GeoMap.vue'
import GeoPano from '~/components/index/GeoPano.vue'

export default {
  components: {
    GeoMap,
    GeoPano
  },
}
</script>
