<template>
  <div class="wrapper">
    <point-land class="wrapper" />
    <help-btn />
    <v-overlay :value="$store.state.loading"> <v-progress-circular indeterminate size="64"></v-progress-circular></v-overlay>
  </div>
</template>

<script>
import PointLand from '~/components/PointLand'
import HelpBtn from '~/components/HelpBtn'

export default {
  components: {
    PointLand,
    HelpBtn
  }
}
</script>

<style src="./index.css"></style>
