<template>
  <div>
    <div id="ol" />
    <div id="naver" />
  </div>
</template>

<script>
export default {}
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
</style>
