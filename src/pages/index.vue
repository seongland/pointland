<template>
  <div class="wrapper">
    <las-cloud class="wrapper" />
    <v-overlay :value="$store.state.loading"> <v-progress-circular indeterminate size="64"></v-progress-circular></v-overlay>
  </div>
</template>

<script>
import LasCloud from '~/components/LasCloud'
import consola from 'consola'

export default {
  components: {
    LasCloud
  },
  fetchOnServer: false,

  async fetch() {},

  async mounted() {},

  computed: {}
}
</script>

<style src="./index.css"></style>
