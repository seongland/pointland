<template>
  <div>
    <v-img :src="src.front" />
    <v-img :src="src.back" />
  </div>
</template>

<script>
export default {
  data: () => ({
    src: {
      front: '/api/image/imms_20200824_193802/snap1/86/front',
      back: '/api/image/imms_20200824_193802/snap1/86/back'
    }
  }),
  mounted() {},
  methods: {}
}
</script>

<style></style>
