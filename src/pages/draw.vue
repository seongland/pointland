<template>
  <div class="wrapper">
    <!-- header -->
    <tab-header />

    <!-- sidebar -->
    <v-card class="sidebar">
      <facility-table />
      <layer-list />
    </v-card>

    <!-- body -->
    <v-card class="main wrapper">
      <v-tabs-items v-model="index" class="wrapper">
        <v-tab-item v-for="(tab, i) in tabs" :key="i" class="wrapper" eager>
          <geo-map id="global-map" v-if="tab.type === 'map'" class="wrapper" />
          <las-cloud v-else-if="tab.type === 'cloud'" class="wrapper" />
          <imms-image v-else-if="tab.type === 'image'" class="wrapper" />
        </v-tab-item>
      </v-tabs-items>
    </v-card>

    <!-- overlay -->
    <v-dialog v-if="submitting" v-model="showSubmit">
      <input-data
        :layer="targetLayer.object ? targetLayer.object.layer : ''"
        :type="targetLayer.object ? targetLayer.object.type : ''"
      />
    </v-dialog>
    <v-dialog v-if="deleting" v-model="deleting"> <del-data :id="$store.state.del.id" /> </v-dialog>
    <v-dialog v-if="editing" v-model="showEdit"> <edit-data :id="$store.state.edit.id" /> </v-dialog>
    <v-dialog v-if="interpolating" v-model="interpolating"> <interpolate /> </v-dialog>

    <!-- loading -->
    <v-overlay :value="$store.state.loading"> <v-progress-circular indeterminate size="64"></v-progress-circular></v-overlay>
  </div>
</template>

<script>
import GeoMap from '~/components/tabs/GeoMap'
import LasCloud from '~/components/tabs/LasCloud'
import ImmsImage from '~/components/tabs/ImmsImage'

import Interpolate from '~/components/overlay/Interpolate'
import InputData from '~/components/overlay/InputData'
import EditData from '~/components/overlay/EditData'
import DelData from '~/components/overlay/DelData'

import FacilityTable from '~/components/sidebar/FacilityTable'
import LayerList from '~/components/sidebar/LayerList'
import TabHeader from '~/components/header/TabHeader'
import consola from 'consola'

export default {
  middleware: 'authentication',
  components: { TabHeader, GeoMap, LasCloud, ImmsImage, InputData, EditData, DelData, FacilityTable, LayerList },
  fetchOnServer: false,

  async fetch() {
    await this.reloadUser()
    const rounds = []
    for (const round of this.$store.state.ls.rounds) {
      const res = await this.$axios.get(`/api/meta/${round.name}`)
      const roundObj = res.data
      rounds.push(roundObj)
    }
    if (process.env.target === 'move') consola.info('Rounds', rounds)
    this.setRounds(rounds)
  },

  async mounted() {
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
      set(value) {
        this.$store.commit('setState', { props: ['submit', 'show'], value })
        this.$store.commit('setState', { props: ['submit', 'ing'], value })
      }
    },
    submitting() {
      return this.$store.state.submit.ing
    },
    showEdit: {
      get() {
        return this.$store.state.edit.show
      },
      set(value) {
        if (value === false) this.drawnFacilities()
        this.$store.commit('setState', { props: ['edit', 'show'], value })
        this.$store.commit('setState', { props: ['edit', 'ing'], value })
      }
    },
    interpolating: {
      get() {
        return this.$store.state.interpolating
      },
      set(value) {
        this.$store.commit('setState', { props: ['interpolating'], value })
      }
    },
    editing() {
      return this.$store.state.edit.ing
    },
    deleting: {
      get() {
        return this.$store.state.del.ing
      },
      set(value) {
        this.$store.commit('setState', { props: ['del', 'ing'], value })
      }
    },
    targetLayer() {
      return this.$store.state.ls.targetLayer
    }
  }
}
</script>

<style src="./draw.css"></style>
