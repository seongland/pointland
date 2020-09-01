<template>
  <v-card id="map-card">
    <geo-map />
  </v-card>
</template>

<script>
import GeoMap from '~/components/index/GeoMap.vue'

export default {
  middleware: 'authentication',
  components: {
    GeoMap
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
    this.olInit()
  }
}
</script>

<style>
#map-card {
  height: 100%;
}
</style>
