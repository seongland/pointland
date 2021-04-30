<template>
  <v-app dark>
    <v-main>
      <nuxt />
    </v-main>
    <v-snackbars :objects.sync="objects" />
    <v-overlay :value="$store.state.loading"> <v-progress-circular indeterminate size="64"/></v-overlay>
  </v-app>
</template>

<script>
import VSnackbars from 'v-snackbars'

export default {
  components: { VSnackbars },
  computed: {
    objects: {
      get() {
        return this.$store.state.snackbar.messages
      },
      set(value) {
        this.$store.commit('setState', { props: ['snackbar', 'messages'], value })
      }
    }
  }
}
</script>
