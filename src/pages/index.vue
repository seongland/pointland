<template>
  <v-card id="map-card">
    <geo-map />
  </v-card>
</template>

<script>
import GeoMap from '~/components/index/GeoMap.vue'

const EMIT_TIMEOUT = 10000

export default {
  components: {
    GeoMap
  },
  async mounted() {
    this.olInit()
    this.$root.ping = await this.$nuxtSocket({
      allowUpgrades: false,
      emitTimeout: EMIT_TIMEOUT,
      transports: ['websocket'],
      name: 'ping',
      teardown: false
    })
    const ping = this.$root.ping

    ping.emit('getEpic')
    ping.on('getEpic', epic => this.drawXYs(epic.latlngs, epic.socketId))
    ping.on('dataSharing', data => {
      this.drawXY(data.latlng, false, data.socketId)
      this.drawXYs(data.latlngs, data.socketId)
    })
  }
}
</script>

<style>
#map-card {
  height: 100%;
}
</style>
