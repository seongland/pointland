<template>
  <div class="wrapper">
    <v-tabs v-model="index" class="header">
      <v-subheader v-text="title + ' ' + meta.version" />
      <v-spacer />
      <v-tab v-for="tab in tabs" :key="tab.name"> {{ tab.name }} </v-tab>
      <v-spacer />
      <v-select
        class="mt-1 mr-2 rounds"
        label="Round"
        solo
        :items="rounds"
        item-text="name"
        v-model="currentRound.name"
        return-object
        dense
      ></v-select>
      <v-select
        class="mt-1 mr-4 snaps"
        label="Snap"
        solo
        :items="currentRound.snaps"
        item-text="name"
        v-model="currentSnap.name"
        return-object
        dense
      ></v-select>
    </v-tabs>
    <v-tabs-items v-model="index" class="main wrapper">
      <v-tab-item v-for="(tab, i) in tabs" :key="i" class="wrapper">
        <geo-map v-if="tab.type==='map'" class="wrapper"/>
        <overlay-pcd v-else-if="tab.type==='3d'" class="wrapper"/>
        <imms-image v-else-if="tab.type==='image'" class="wrapper"/>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
import GeoMap from '~/components/tabs/GeoMap.vue'
import OverlayPcd from '~/components/tabs/OverlayPcd.vue'
import ImmsImage from '~/components/tabs/ImmsImage.vue'

export default {
  middleware: 'authentication',
  components: {
    GeoMap, OverlayPcd, ImmsImage
  },
  async mounted() {
    this.meta.version = process.env.version
    const localStorage = this.$store.state.localStorage
    const accessToken = localStorage.accessToken
    const config = { headers: { Authorization: accessToken } }
    const res = await this.$axios.get(
      `/api/user?id=${localStorage.user.id}`,
      config
    )
    const user = res?.data[0]
    await this.loadProjects(user, accessToken)
    this.$store.commit('localStorage/login', { accessToken, user })
  }
}
</script>

<style>
.v-select.rounds {
  width: 300px !important;
}
.v-select.snaps {
  width: 150px !important;
}
.wrapper {
  height: 100%; 
  display: flex;
  flex-flow: column;
}
.header {
  flex: 0 1 auto;
}
.main {
  flex: 1 1 auto;
}
</style>
