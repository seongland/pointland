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

          <v-list>
            <v-list-item link>
              <v-list-item-content>
                <v-list-item-subtitle v-text="`Logout`" @click="$store.commit('ls/logout')" />
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-list>
      </v-navigation-drawer>

      <v-tabs-items v-model="index" class="wrapper">
        <v-tab-item v-for="(tab, i) in tabs" :key="i" class="wrapper" eager>
          <geo-map id="global-map" v-if="tab.type === 'map'" class="wrapper" />
          <las-cloud v-else-if="tab.type === 'cloud'" class="wrapper" />
          <imms-image v-else-if="tab.type === 'image'" class="wrapper" />
        </v-tab-item>
      </v-tabs-items>
    </v-card>

    <v-overlay :value="$store.state.loading"> <v-progress-circular indeterminate size="64"></v-progress-circular></v-overlay>
  </div>
</template>

<script>
import GeoMap from '~/components/tabs/GeoMap'
import LasCloud from '~/components/tabs/LasCloud'
import ImmsImage from '~/components/tabs/ImmsImage'
import classes from '~/assets/classes'

export default {
  middleware: 'authentication',
  components: { GeoMap, LasCloud, ImmsImage },
  data: () => ({ classes }),

  async mounted() {
    this.reloadUser()
    this.eventBind()
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

<style src="./draw.css"></style>
