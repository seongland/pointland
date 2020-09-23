<template>
</template>

<script>
import GeoMap from '~/components/index/GeoMap.vue'

export default {
  middleware: 'authentication',
  components: {
    GeoMap
  },
  async mounted() {
    const localStorage = this.$store.state.localStorage
    const accessToken = localStorage.accessToken
    const config = { headers: { Authorization: accessToken } }
    const res = await this.$axios.get(
      `/api/user?id=${localStorage.user.id}`,
      config
    )
    const user = res?.data[0]
    await this.loadProjects(user, accessToken)
    this.$store.commit('localStorage/login', { accessToken, user })
    }
}
</script>

<style>
.map-wrapper {
  height: 100%;
}
</style>
