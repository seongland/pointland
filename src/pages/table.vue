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
const MAX_TIME = 10

export default {
  middleware: 'authentication',
  components: {},
  data: () => ({
    vhcls: [
      {
        name: 'Test 1',
        time: 'Fri Aug 28 2020 16:09:33 GMT+0900 (Korean Standard Time)',
        address: '1.1.1.1',
        latlng: [127, 34],
        remain: MAX_TIME
      },
      {
        name: 'Test 2',
        time: 'Fri Aug 28 2020 16:09:33 GMT+0900 (Korean Standard Time)',
        address: '8.8.8.8',
        latlng: [127, 37],
        remain: MAX_TIME
      }
    ],
    headers: [
      { text: 'Name', value: 'name' },
      { text: 'Connected', value: 'time' },
      { text: 'IP', value: 'address' },
      { text: 'Location', value: 'latlng' },
      { text: '', value: 'remain', filter: value => value >= 0 }
    ]
  }),
  methods: {},

  async fetch() {
    const ping = await this.$nuxtSocket({
      allowUpgrades: false,
      transports: ['websocket'],
      name: 'ping',
      teardown: true
    })
    this.$store.commit('localStorage/setPrj', {
      prj: this.$store.state.localStorage.prj,
      id: this.$store.state.localStorage.prjId,
      socket: ping
    })
    ping.on('dataSharing', data => {
      let already = false
      for (const vhcl of this.vhcls)
        if (vhcl.socketId === data.socketId) {
          already = true
          vhcl.remain = MAX_TIME
        }
      if (!already) {
        data.remain = MAX_TIME
        this.vhcls.push(data)
      }
    })

    setInterval(() => {
      for (const vhcl of this.vhcls) vhcl.remain -= 1
    }, 1000)
    this.$root.ping = ping
  },
  fetchOnServer: false
}
</script>

<style></style>
