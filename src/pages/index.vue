<template>
  <div class="wrapper">
    <client-only>
      <point-land class="wrapper" />
    </client-only>
    <help-btn />
    <landmark-btns />
    <div class="source-info">
      This pointcloud source is from
      <a href="https://3dview.tokyo-digitaltwin.metro.tokyo.lg.jp/" target="_blank" rel="noopener noreferrer">City of Tokyo</a>
    </div>
    <v-overlay :value="$store.state.loading">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </div>
</template>

<script lang="ts">
import LandmarkBtns from '~/components/LandmarkBtns.vue'
export default { components: { LandmarkBtns } }
</script>

<style src="~/assets/style/index.css" />
<style>
.source-info {
  position: fixed;
  bottom: 0.5em;
  left: 0.5em;
  font-size: 0.75rem;
  color: #eee;
  opacity: 0.7;
  z-index: 2;
}
</style>
