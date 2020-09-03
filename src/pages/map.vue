<template>
  <div class="map-wrapper">
    <v-card class="map-wrapper" v-if="projects.length">
      <geo-map />
    </v-card>

    <v-container class="fill-height" fluid v-if="!projects.length">
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="4">
          <v-card class="elevation-24">
            <v-toolbar dark flat>
              <v-toolbar-title>No Project</v-toolbar-title>
            </v-toolbar>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import GeoMap from '~/components/index/GeoMap.vue'

export default {
  middleware: 'authentication',
  components: {
    GeoMap
  },
  computed: {
    projects() {
      return this.$store.state.localStorage?.user?.projects ?? []
    }
  },
  async mounted() {
    let ping = this.$root.ping
    if (!ping)
      ping = await this.$nuxtSocket({
        allowUpgrades: false,
        transports: ['websocket'],
        name: 'ping',
        teardown: true
      })
    else {
      ping.off('getState')
      ping.off('dataSharing')
    }
    ping.emit('getState')
    ping.on('getState', state => this.drawXYs(state.latlngs, state.socketId))
    ping.on('dataSharing', data => {
      this.drawXY(data.latlng, false, data.socketId)
      this.drawXYs(data.latlngs, data.socketId)
    })
  }
}
</script>

<style>
.map-wrapper {
  height: 100%;
}
</style>
