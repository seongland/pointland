<template>
  <v-layout row wrap align-center>
    <v-flex xs12 sm12 md6>
      <v-container>
        <v-card>
          <geo-table />
          <v-card-title>
            GeoPano
          </v-card-title>
        </v-card>
      </v-container>
    </v-flex>
    <v-flex xs12 sm12 md12>
      <br />
      <div class="text-center">
        <logo />
      </div>
      <br />

      <v-card>
        <v-card-title class="headline">
          GeoMap
        </v-card-title>
      </v-card>

      <br />

      <v-card>
        <v-card-title class="headline">
          Panorama
        </v-card-title>

        <!-- Card Action Part -->
        <geo-pano />
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" nuxt to="/sub">
            Continue
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapState } from 'vuex'
import Logo from '~/components/Logo.vue'
import GeoPano from '~/components/index/GeoPano.vue'
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
    Logo,
    GeoPano,
    GeoTable
  }
}
</script>
