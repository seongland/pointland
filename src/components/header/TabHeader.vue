<template>
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
export default {
  computed: {
    index: {
      get() {
        return this.$store.state.index
      },
      set(values) {
        this.$store.commit('setIndex', values)
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
    }
  }
}
</script>
