<template>
  <div class="wrapper">
    <las-cloud class="wrapper" />
    <help-btn />
    <v-overlay :value="$store.state.loading"> <v-progress-circular indeterminate size="64"></v-progress-circular></v-overlay>
  </div>
</template>

<script>
import LasCloud from '~/components/LasCloud'
import HelpBtn from '~/components/HelpBtn'

export default {
  components: {
    LasCloud,
    HelpBtn
  }
}
</script>

<style src="./index.css"></style>
