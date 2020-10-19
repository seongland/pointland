<template>
  <v-row align="center" justify="center">
    <v-col lg="6" md="8" sm="12">
      <v-card class="elevation-24">
        <v-card-title v-text="layerObj.description" />
        <v-divider />
        <v-card-title> Geometry </v-card-title>
        <v-card-text v-text="`X : ${selected[0].properties.x}`" />
        <v-card-text v-text="`Y : ${selected[0].properties.y}`" />
        <v-card-text v-text="`Z : ${selected[0].properties.z}`" />
        <v-card-text v-text="`Longitude : ${selected[0].geometry.coordinates[0]}`" />
        <v-card-text v-text="`Latitude : ${selected[0].geometry.coordinates[1]}`" />

        <v-divider />
        <v-card-title v-text="`Image`" />
        <v-card-text v-text="`Round : ${ls.currentRound.name}`" />
        <v-card-text v-text="`Snap : ${ls.currentSnap.name}`" />
        <v-card-text v-text="`Mark : ${ls.currentMark.name}`" />
        <v-card-text v-text="`X : ${relations.images[0].coordinates[0]}`" />
        <v-card-text v-text="`Y : ${relations.images[0].coordinates[1]}`" />
        <v-divider />

        <v-card-title> Comment </v-card-title>
        <v-card-text>
          <v-text-field label="Comment" v-model="comment" />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="submit">Submit</v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data: () => ({ comment: undefined }),
  computed: {
    relations() {
      return this.$store.state.selected[0].relations
    },
    layerObj() {
      return this.$store.state.targetLayer.object
    },
    ls() {
      return this.$store.state.ls
    },
    selected() {
      return this.$store.state.selected
    }
  },
  methods: {
    async submit() {
      const commit = this.$store.commit
      await commit('submit', {
        comment: this.comment,
        type: 'Point',
        args: {
          layer: this.layerObj.layer
        }
      })
    }
  }
}
</script>

<style></style>
