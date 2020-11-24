<template>
  <v-tabs v-model="index" class="header">
    <v-subheader v-text="identifier" />
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
      :items="currentRound ? currentRound.snaps : []"
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
      :items="currentSnap ? currentSnap.marks : []"
      item-text="name"
      item-value="name"
      v-model="currentMark"
      return-object
      dense
    ></v-select>
  </v-tabs>
</template>

<script>
import consola from 'consola'

export default {
  computed: {
    index: {
      get() {
        return this.$store.state.ls.index
      },
      set(values) {
        this.$store.commit('ls/setIndex', values)
      }
    },
    identifier() {
      return this.title + ' ' + this.meta.version
    },
    currentRound: {
      get() {
        return this.$store.state.ls.currentRound
      },
      set(values) {
        if (process.env.dev) consola.info('Set Round', values)
        this.setRound(values)
      }
    },
    currentSnap: {
      get() {
        return this.$store.state.ls.currentSnap
      },
      set(values) {
        if (process.env.dev) consola.info('Set Snap', values)
        this.setSnap(values)
      }
    },
    currentMark: {
      get() {
        return this.$store.state.ls.currentMark
      },
      set(values) {
        if (process.env.dev) consola.info('Set Mark', values)
        this.setMark(values)
      }
    }
  },

  async mounted() {
    this.meta.version = process.env.version
  }
}
</script>
