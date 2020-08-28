<template>
  <v-container>
    <v-data-table
      :headers="headers"
      :items="vhcls"
      :items-per-page="15"
      class="elevation-1"
    ></v-data-table>
  </v-container>
</template>

<script>
export default {
  components: {},
  data: () => ({
    vhcls: [
      {
        name: 'Test 1',
        time: 'Fri Aug 28 2020 16:09:33 GMT+0900 (Korean Standard Time)',
        address: '1.1.1.1',
        latlng: [127, 34]
      },
      {
        name: 'Test 2',
        time: 'Fri Aug 28 2020 16:09:33 GMT+0900 (Korean Standard Time)',
        address: '8.8.8.8',
        latlng: [127, 37]
      }
    ],
    headers: [
      { text: 'Name', value: 'name' },
      { text: 'Connected', value: 'time' },
      { text: 'IP', value: 'address' },
      { text: 'Location', value: 'latlng' }
    ]
  }),
  methods: {},
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
    ping.on('dataSharing', data => {
      this.vhcls.push(data)
    })
  }
}
</script>

<style></style>
