<template>
  <v-layout>
    <v-flex xs12 sm8 md6>
      <v-card>
        <v-card-title class="headline">
          POIs
        </v-card-title>

        <!-- Card Action Part -->
        <geo-map />
        <geo-table />
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" nuxt to="/">
            Continue
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapState } from 'vuex'
import GeoPano from '~/components/index/GeoPano.vue'
import GeoMap from '~/components/index/GeoMap.vue'
import GeoTable from '~/components/index/GeoTable.vue'

export default {
  fetch({ store }) {
    store.commit('increment')
  },
  computed: mapState(['counter']),
  methods: {
    increment() {
      this.$store.commit('increment')
    }
  },
  components: {
    GeoMap,
    GeoPano,
    GeoTable
  }
}
</script>
