<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm8 md6>
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

      <br />

      <v-card>
        <v-card-title class="headline">
          Table
        </v-card-title>
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
import Logo from '~/components/Logo.vue'
import GeoPano from '~/components/index/GeoPano.vue'

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
    GeoPano
  }
}
</script>
