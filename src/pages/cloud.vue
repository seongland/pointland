<template>
  <overlay-pcd />
</template>

<script>
import OverlayPcd from '~/components/cloud/OverlayPcd'

export default {
  middleware: 'authentication',
  components: { OverlayPcd },
  data: () => ({}),
  methods: {},
  async fetch() {},
  fetchOnServer: false
}
</script>

<style></style>
