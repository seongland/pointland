<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm8 md6>

      <br/>
      <div class="text-center">
        <logo/>
      </div>
      <br/>

      <v-card>
        <v-card-title class="headline">
          GeoMap
        </v-card-title>
        <map/>

        <v-card-text>
          <p>
          </p>
          <p>Thank you for developing with Vuetify and I look forward to bringing more exciting features in the future.</p>
          <div class="text-xs-right">
            <em><small>&mdash; John Leider</small></em>
          </div>
          
        </v-card-text>
      </v-card>

      <br/>
    
      <v-card>
        <v-card-title class="headline">
          Panorama
        </v-card-title>

        <!-- Card Action Part -->
        <pano/>
        <v-card-actions>
          <v-spacer/>
          <v-btn color="primary" nuxt to="/sub">
            Continue
          </v-btn>
        </v-card-actions>
      </v-card>

      <br/>
    
      <v-card>
        <v-card-title class="headline">
          Table
        </v-card-title>
        <table/>
        <v-card-actions>
          <v-spacer/>
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
import Map from '~/components/index/Map.vue'
import Pano from '~/components/index/Pano.vue'
import Table from '~/components/index/Table.vue'

export default {
  fetch ({ store }) {
    store.commit('increment')
  },
  computed: mapState([
    'counter'
  ]),
  methods: {
    increment () {
      this.$store.commit('increment')
    }
  },
  components: {
    Logo,
    Pano,
    Table
  }
}
</script>
