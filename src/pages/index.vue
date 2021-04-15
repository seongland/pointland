<template>
  <div class="wrapper">
    <point-land class="wrapper" />
    <help-btn />
    <v-overlay :value="$store.state.loading"> <v-progress-circular indeterminate size="64"></v-progress-circular></v-overlay>
  </div>
</template>

<script>
export default {}
</script>

<style src="~/assets/style/index.css" />
