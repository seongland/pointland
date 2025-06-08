<template>
  <div class="wrapper">
    <client-only>
      <point-land class="wrapper" />
    </client-only>
    <help-btn />
    <landmark-btns />
    <v-overlay :value="$store.state.loading"> <v-progress-circular indeterminate size="64"></v-progress-circular></v-overlay>
  </div>
</template>

<script lang="ts">
import LandmarkBtns from '~/components/LandmarkBtns.vue'
export default { components: { LandmarkBtns } }
</script>

<style src="~/assets/style/index.css" />
