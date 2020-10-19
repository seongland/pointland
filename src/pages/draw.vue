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
        :items="$store.state.ls.rounds"
        item-text="name"
        item-value="name"
        v-model="currentRound"
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
        return-object
        dense
      ></v-select>
      <v-select
        class="mt-1 mr-4 marks"
        label="Mark"
        solo
        :items="currentSnap.marks"
        item-text="name"
        item-value="name"
        v-model="currentMark"
        return-object
        dense
      ></v-select>
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
              <v-list-item
                link
                v-for="layerObj in classObj.layers"
                :key="layerObj.layer"
                @click="setLayer({ object: layerObj })"
              >
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
                <v-list-item-subtitle v-text="`Help`" @click="$router.push('/help')" />
              </v-list-item-content>
            </v-list-item>
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
    <v-dialog v-if="submitting" v-model="showSubmit"> <input-data /></v-dialog>
    <v-overlay :value="$store.state.loading"> <v-progress-circular indeterminate size="64"></v-progress-circular></v-overlay>
  </div>
</template>

<script>
import GeoMap from '~/components/tabs/GeoMap'
import LasCloud from '~/components/tabs/LasCloud'
import ImmsImage from '~/components/tabs/ImmsImage'
import InputData from '~/components/overlay/InputData'
import classes from '~/assets/morai'

export default {
  middleware: 'authentication',
  components: { GeoMap, LasCloud, ImmsImage, InputData },
  data: () => ({ classes }),
  fetchOnServer: false,

  async fetch() {
    const currentRoundName = this.$store.state.ls.rounds[0].name
    const res = await this.$axios.get(`/api/meta/${currentRoundName}`)
    const roundObj = res.data
    if (process.env.dev) console.log('Round Object', roundObj)
    this.setRounds([roundObj])
  },

  async mounted() {
    this.reloadUser()
    this.eventBind()
  },

  computed: {
    index: {
      get() {
        return this.$store.state.ls.index
      },
      set(values) {
        this.$store.commit('ls/setIndex', values)
      }
    },
    showSubmit: {
      get() {
        return this.$store.state.submit.show
      },
      set(values) {
        this.$store.commit('setShowSubmit', values)
      }
    },
    submitting: {
      get() {
        return this.$store.state.submit.ing
      },
      set(values) {
        this.$store.commit('setSubmitting', values)
      }
    },
    currentRound: {
      get() {
        return this.$store.state.ls.currentRound
      },
      set(values) {
        if (process.env.dev) console.log('Set Round', values)
        this.setRound(values)
      }
    },
    currentSnap: {
      get() {
        return this.$store.state.ls.currentSnap
      },
      set(values) {
        if (process.env.dev) console.log('Set Snap', values)
        this.setSnap(values)
      }
    },
    currentMark: {
      get() {
        return this.$store.state.ls.currentMark
      },
      set(values) {
        if (process.env.dev) console.log('Set Mark', values)
        this.setMark(values)
      }
    },
    layerIndex: {
      get() {
        return this.$store.state.targetLayer.index
      },
      set(values) {
        this.setLayer({ index: values })
      }
    }
  }
}
</script>

<style src="./draw.css"></style>
