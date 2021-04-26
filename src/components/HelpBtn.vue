<template>
  <div>
    <v-speed-dial id="dial" absolute top left direction="bottom" :open-on-hover="false" :transition="transition">
      <template v-slot:activator>
        <v-btn id="fab" light fab small>
          <v-icon @click="click" light> fas fa-question </v-icon>
        </v-btn>
      </template>
    </v-speed-dial>

    <v-dialog v-model="fab"><help /></v-dialog>
  </div>
</template>

<script>
import Help from '~/components/Help'

export default {
  components: {
    Help
  },

  data: () => ({
    fab: false,
    transition: 'slide-y-transition'
  }),

  methods: {
    click() {
      this.fab = true
    }
  }
}
</script>

<style>
#dial {
  top: 2em;
  left: 1.5em;
}
</style>
