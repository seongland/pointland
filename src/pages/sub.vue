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
            <geo-map />
          </v-card>
        </v-container>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
import GeoMap from '~/components/index/GeoMap.vue'
import GeoTable from '~/components/index/GeoTable.vue'

export default {
  components: {
    GeoMap,
    GeoTable
  },
  fetch({ store }) {
    store.commit('increment')
  },
  computed: mapState(['counter']),
  methods: {
    increment() {
      this.$store.commit('increment')
    }
  }
}
</script>
