<template>
  <div class="wrapper">
    <point-land class="wrapper" />
    <help-btn />
    <v-overlay :value="store.state.loading">
      <v-progress-circular indeterminate size="64" />
    </v-overlay>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useStore } from 'vuex'
import PointLand from '@/components/PointLand.vue'
import HelpBtn from '@/components/HelpBtn.vue'

export default defineComponent({
  components: { PointLand, HelpBtn },
  setup() {
    const store = useStore()
    return { store }
  }
})
</script>

<style src="@/assets/style/index.css" />
