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
        item-value="name"
        v-model="currentRound"
        @change="changeRound"
        return-object
        dense
      ></v-select>
      <v-select
        class="mt-1 mr-4 snaps"
        label="Snap"
        solo
        :items="currentRound.snaps"
        item-text="name"
        item-value="name"
        v-model="currentSnap"
        @change="changeSnap"
        return-object
        dense
      ></v-select>
      <v-select
        class="mt-1 mr-4 seqs"
        label="Seq"
        solo
        :items="seqs"
        v-model="currentSeq"
        @change="changeSeq"
        dense
      ></v-select>
    </v-tabs>
    <v-tabs-items v-model="index" class="main wrapper">
      <v-tab-item v-for="(tab, i) in tabs" :key="i" class="wrapper" eager>
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
    rounds() {
      return this.$store.state.ls.rounds
    },
    index: {
      get() {
        return this.$store.state.ls.index
      },
      set(values) {
        this.$store.commit('ls/setIndex', values)
      }
    },
    currentRound: {
      get() {
        return this.$store.state.ls.currentRound
      },
      set(values) {
        console.log(values)
        this.changeRound(values)
      }
    },
    currentSnap: {
      get() {
        return this.$store.state.ls.currentSnap
      },
      set(values) {
        console.log(values)
        this.changeSnap(values)
      }
    },
    currentSeq: {
      get() {
        return this.$store.state.ls.currentSeq
      },
      set(values) {
        console.log(values)
        this.changeSeq(values)
      }
    }
  },
  async mounted() {
    this.meta.version = process.env.version
    const ls = this.$store.state.ls
    const accessToken = ls.accessToken
    const config = { headers: { Authorization: accessToken } }
    const res = await this.$axios.get(`/api/user?id=${ls.user.id}`, config)
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
