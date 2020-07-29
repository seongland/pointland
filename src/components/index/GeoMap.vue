<template>
  <div>
    <div id="ol" />
    <div id="naver" />
    <v-dialog
      :absolute="true"
      :value="overlay"
      :z-index="1000"
      @keydown.esc="overlay = false"
    >
      <overlay-pcd />
    </v-dialog>
  </div>
</template>

<script>
import OverlayPcd from '~/components/cloud/OverlayPcd'

export default {
  components: {
    OverlayPcd
  },
  data: () => ({ overlay: false }),
  methods: {},
  mounted() {
  }
}
</script>

<style>
#ol,
#naver {
  height: 100%;
  width: 100%;
  position: absolute !important;
  z-index: 1;
}
#naver {
  z-index: 0;
}
.ol-zoom {
  top: unset !important;
  bottom: 1.6em !important;
  left: 1em;
}
.ol-zoom-in,
.ol-zoom-out {
  background-color: #646464 !important;
  opacity: 1 !important;
}
</style>
