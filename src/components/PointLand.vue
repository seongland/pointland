/* * @summary - point land component */

<template>
  <div>
    <div id="nipple" v-if="touchable" style="overflow: hidden" />
    <div id="pointland" />
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, onMounted, getCurrentInstance } from 'vue'
import { useStore } from 'vuex'
import usePointland from '@/composables/usePointland'
import useController from '@/composables/useController'

export default defineComponent({
  setup() {
    const store = useStore()
    const vm = getCurrentInstance()?.proxy as any
    const move = reactive({ move: { camera: false, vertical: false, target: false } })
    const { startLand } = usePointland(store, vm)
    const { checkTouchable, touchable } = useController()

    onMounted(() => {
      const layerspace = startLand()
      checkTouchable(layerspace.space)
    })

    return { ...toRefs(move), touchable }
  },
})
</script>

<style>
#pointland,
#nipple {
  height: 100%;
  width: 100%;
  position: absolute;
}
#nipple {
  z-index: 1;
}
</style>
