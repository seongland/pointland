<template>
  <v-layout row wrap align-center>
    <v-flex xs12 sm12 md6>
      <v-container>
        <v-card>
          <geo-pano />
          <v-card-title>
            GeoPano
          </v-card-title>
        </v-card>
      </v-container>
    </v-flex>

    <v-flex xs12 sm12 md6>
      <v-container>
        <v-card>
          <geo-map />
          <v-card-title>
            GeoMap
          </v-card-title>
        </v-card>
      </v-container>
    </v-flex>
    <v-flex xs12 sm12 md6>
      <v-container>
        <v-card>
          <geo-table />
          <v-card-title>
            GeoTable
          </v-card-title>
        </v-card>
      </v-container>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapState } from 'vuex'
import Logo from '~/components/Logo.vue'
import GeoPano from '~/components/index/GeoPano.vue'
import GeoMap from '~/components/index/GeoMap.vue'
import GeoTable from '~/components/index/GeoTable.vue'

export default {
  mounted() {
    this.mapPano()
  },
  components: {
    Logo,
    GeoPano,
    GeoTable,
    GeoMap
  }
}
</script>
