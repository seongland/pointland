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
        @change="setRound"
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
        @change="setSnap"
        return-object
        dense
      ></v-select>
      <v-select class="mt-1 mr-4 seqs" label="Seq" solo :items="seqs" v-model="currentSeq" @change="setSeq" dense></v-select>
    </v-tabs>

    <v-card class="main wrapper">
      <v-navigation-drawer permanent expand-on-hover app color="grey darken-4">
        <v-list>
          <v-list-item class="px-2">
            <v-list-item-avatar>
              <v-img src="/profile.png"></v-img>
            </v-list-item-avatar>
          </v-list-item>

          <v-divider></v-divider>

          <v-list-item link>
            <v-list-item-content>
              <v-list-item-subtitle v-text="$store.state.ls.user.email" />
            </v-list-item-content>
          </v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-list nav dense>
          <v-list-item-group v-model="layerIndex" color="primary">
            <div v-for="classObj in classes" :key="classObj.class">
              <v-list-item link v-for="layerObj in classObj.layers" :key="layerObj.layer" @click="setLayer({ layerObj })">
                <v-list-item-icon v-text="layerObj.layer" />
                <v-list-item-title v-text="layerObj.description" />
                <v-list-item-subtitle v-text="layerObj.type" />
              </v-list-item>
              <v-divider></v-divider>
            </div>
          </v-list-item-group>
        </v-list>
      </v-navigation-drawer>

      <v-tabs-items v-model="index" class="wrapper">
        <v-tab-item v-for="(tab, i) in tabs" :key="i" class="wrapper" eager>
          <geo-map id="global-map" v-if="tab.type === 'map'" class="wrapper" />
          <overlay-pcd v-else-if="tab.type === 'cloud'" class="wrapper" />
          <imms-image v-else-if="tab.type === 'image'" class="wrapper" />
        </v-tab-item>
      </v-tabs-items>
    </v-card>
  </div>
</template>

<script>
import GeoMap from '~/components/tabs/GeoMap'
import OverlayPcd from '~/components/tabs/OverlayPcd'
import ImmsImage from '~/components/tabs/ImmsImage'
import classes from '~/assets/classes'

export default {
  middleware: 'authentication',
  components: {
    GeoMap,
    OverlayPcd,
    ImmsImage
  },
  data: () => ({
    classes
  }),
  async mounted() {
    const mapWrapper = document.getElementById('global-map').parentElement
    if (this.index !== 0) mapWrapper.classList.add('small-map')
    setTimeout(() => window.dispatchEvent(new Event('resize')))

    this.meta.version = process.env.version
    const ls = this.$store.state.ls
    const accessToken = ls.accessToken
    const config = { headers: { Authorization: accessToken } }
    const res = await this.$axios.get(`/api/user?id=${ls.user.id}`, config)
    const user = res?.data[0]
    await this.loadProjects(user, accessToken)
    this.$store.commit('ls/login', { accessToken, user })
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
        this.setRound(values)
      }
    },
    currentSnap: {
      get() {
        return this.$store.state.ls.currentSnap
      },
      set(values) {
        this.setSnap(values)
      }
    },
    currentSeq: {
      get() {
        return this.$store.state.ls.currentSeq
      },
      set(values) {
        this.setSeq(values)
      }
    },
    layerIndex: {
      get() {
        return this.$store.state.drawLayer.index
      },
      set(values) {
        this.setLayer({ index: values })
      }
    }
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
.small-map {
  position: fixed !important;
  width: 500px !important;
  bottom: 10px !important;
  right: 10px !important;
  height: 500px !important;
  z-index: 5 !important;
  display: block !important;
  overflow: hidden !important;
  border-radius: 10px !important;
  box-shadow: 20px 20px 60px #000, -20px -20px 60px #0007 !important;
}
</style>
