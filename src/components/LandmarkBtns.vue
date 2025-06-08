<template>
  <div id="landmark-btns">
    <v-btn
      v-for="(lm, i) in landmarks"
      :key="lm.name"
      small
      class="ma-1"
      @click="go(i)"
    >
      {{ i + 1 }}
    </v-btn>
  </div>
</template>

<script>
import landmarks from '~/data/landmarks'

export default {
  data() {
    return { landmarks }
  },
  mounted() {
    window.addEventListener('keydown', this.shortcut)
  },
  beforeDestroy() {
    window.removeEventListener('keydown', this.shortcut)
  },
  methods: {
    go(i) {
      const lm = this.landmarks[i]
      if (!this.$root.$layerspace) return
      const controls = this.$root.$layerspace.space.controls
      const p = lm.position
      controls.setLookAt(p[0] + 2000, p[1] + 2000, p[2] + 500, p[0], p[1], p[2], true)
    },
    shortcut(e) {
      const keyMap = { F1: 0, F2: 1, F3: 2, F4: 3, F5: 4 }
      if (keyMap[e.code] !== undefined) this.go(keyMap[e.code])
    },
  },
}
</script>

<style>
#landmark-btns {
  position: fixed;
  top: 1em;
  right: 1em;
  z-index: 10;
}
</style>
