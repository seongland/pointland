<template> </template>

<template>
  <v-navigation-drawer right permanent app color="grey darken-4">
    <v-list>
      <v-list-item> </v-list-item>
      <v-list-item> </v-list-item>
    </v-list>

    <v-divider></v-divider>

    <v-list nav dense>
      <v-list-item-group v-model="layerIndex" color="primary"> </v-list-item-group>

      <v-list>
        <v-list-item link> </v-list-item>
      </v-list>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  data: () => ({}),

  computed: {
    layerIndex: {
      get() {
        return this.$store.state.ls.targetLayer.index
      },
      set(values) {
        this.setLayer({ index: values })
      }
    }
  }
}
</script>
