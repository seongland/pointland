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
import { defineComponent, getCurrentInstance } from '@vue/composition-api'
import { Store } from 'vuex'
import Vue from 'vue'
import PointLand from '@/components/PointLand.vue'
import HelpBtn from '@/components/HelpBtn.vue'

export default defineComponent({
  components: { PointLand, HelpBtn },
  setup() {
    const vm = getCurrentInstance()?.proxy as Vue & { $store: Store<any> }
    const store = vm.$store
    return { store }
  }
})
</script>

<style src="@/assets/style/index.css" />
