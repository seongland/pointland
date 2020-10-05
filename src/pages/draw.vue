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
        :items="ls.rounds"
        item-text="name"
        v-model="ls.currentRound.name"
        return-object
        dense
      ></v-select>
      <v-select
        class="mt-1 mr-4 snaps"
        label="Snap"
        solo
        :items="ls.currentRound.snaps"
        item-text="name"
        v-model="ls.currentSnap.name"
        return-object
        dense
      ></v-select>
      <v-select
        class="mt-1 mr-4 seqs"
        label="Seq"
        solo
        :items="seqs"
        v-model="ls.currentSeq"
        return-object
        @change="changeSeq"
        dense
      ></v-select>
    </v-tabs>
    <v-tabs-items v-model="index" class="main wrapper">
      <v-tab-item v-for="(tab, i) in tabs" :key="i" class="wrapper">
        <geo-map v-if="tab.type === 'map'" class="wrapper" />
        <overlay-pcd v-else-if="tab.type === '3d'" class="wrapper" />
        <imms-image v-else-if="tab.type === 'image'" class="wrapper" />
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
    GeoMap,
    OverlayPcd,
    ImmsImage
  },
  computed: {
    seqs() {
      const init = new Array(this.$store.state.ls.currentSnap.count).fill(0)
      const seqs = init.map((v, i) => i)
      return seqs
    },
    ls() {
      return this.$store.state.ls
    }
  },
  async mounted() {
    this.meta.version = process.env.version
    const ls = this.$store.state.ls
    const accessToken = ls.accessToken
    const config = { headers: { Authorization: accessToken } }
    const res = await this.$axios.get(
      `/api/user?id=${ls.user.id}`,
      config
    )
    const user = res?.data[0]
    await this.loadProjects(user, accessToken)
    this.$store.commit('ls/login', { accessToken, user })
  }
}
</script>

<style>
.v-select.rounds {
  width: 150px !important;
}
.v-select.snaps {
  width: 50px !important;
}
.v-select.seqs {
  width: 10px !important;
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
