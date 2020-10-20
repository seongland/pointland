<template>
  <v-row align="center" justify="center">
    <v-col lg="6" md="8" sm="12">
      <v-card class="elevation-24">
        <v-card-title v-text="description" />
        <v-divider />
        <v-card-title> Geometry </v-card-title>
        <v-card-text class="py-0"
          ><span style="font-weight: bold">X : </span> {{ selected[0].properties.x }} -
          <span style="font-weight: bold">Y : </span> {{ selected[0].properties.y }} -
          <span style="font-weight: bold">Z : </span> {{ selected[0].properties.z }}
        </v-card-text>

        <v-card-text class="pt-0">
          <span style="font-weight: bold">Longitude : </span> {{ selected[0].geometry.coordinates[0] }} -
          <span style="font-weight: bold">Latitude : </span> {{ selected[0].geometry.coordinates[1] }}
        </v-card-text>

        <v-divider />

        <v-card-title v-text="`Image`" />

        <v-card-text class="py-0"
          ><span style="font-weight: bold">Round : </span> {{ ls.currentRound.name }} -
          <span style="font-weight: bold">Snap : </span> {{ ls.currentSnap.name }} -
          <span style="font-weight: bold">Mark : </span> {{ ls.currentMark.name }}
        </v-card-text>

        <v-card-text class="pt-0"
          ><span style="font-weight: bold">Pixel X : </span> {{ relations.images[0].coordinates[0] }} -
          <span style="font-weight: bold">Pixel Y : </span> {{ relations.images[0].coordinates[1] }}
        </v-card-text>

        <v-card-title v-text="`Properties`" />

        <v-select
          class="mx-4"
          label="Layer"
          solo
          return-object
          dense
          v-model="targetLayer"
          :items="sameTypes"
          item-text="description"
          item-value="description"
        ></v-select>

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
import A from '~/assets/classes/morai/A'
import B from '~/assets/classes/morai/B'
import C from '~/assets/classes/morai/C'
import D from '~/assets/classes/morai/D'

const classes = [A, B, C, D]

export default {
  data: () => ({ comment: undefined, description: undefined }),
  props: {
    layer: String,
    type: String
  },
  computed: {
    relations() {
      return this.$store.state.selected[0].relations
    },
    targetLayer: {
      get() {
        for (const classObj of Object.values(classes))
          for (const layerObj of classObj.layers)
            if (this.layer === layerObj.layer) {
              this.description = layerObj.description
              return layerObj
            }
      },
      set(layerObj) {
        this.description = layerObj.description
        return layerObj
      }
    },
    sameTypes() {
      let types = []
      for (const classObj of Object.values(classes))
        for (const layerObj of classObj.layers) if (this.type === layerObj.type) types.push(layerObj)
      return types
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
      commit('submit', {
        comment: this.comment,
        type: 'Point',
        args: { layer: this.layerObj.layer }
      })
    }
  }
}
</script>

<style></style>
