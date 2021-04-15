<template>
  <div class="wrapper">
    <client-only>
      <point-land class="wrapper" />
    </client-only>
    <help-btn />
    <v-overlay :value="$store.state.loading"> <v-progress-circular indeterminate size="64"></v-progress-circular></v-overlay>
  </div>
</template>

<script>
export default {}
</script>

<style src="~/assets/style/index.css" />
