<template>
  <v-row align="center" justify="center">
    <v-col lg="6" md="8" sm="12">
      <v-card class="elevation-24">
        <v-card-title v-text="description" />
        <v-divider />
        <v-card-title> Geometry </v-card-title>
        <v-card-text class="py-0"
          ><span style="font-weight: bold">X : </span> {{ facility ? facility.properties.x : 0 }} -
          <span style="font-weight: bold">Y : </span> {{ facility ? facility.properties.y : 0 }} -
          <span style="font-weight: bold">Z : </span> {{ facility ? facility.properties.z : 0 }}
        </v-card-text>

        <v-card-text class="pt-0">
          <span style="font-weight: bold">Longitude : </span> {{ facility ? facility.geometry.coordinates[0] : 0 }} -
          <span style="font-weight: bold">Latitude : </span> {{ facility ? facility.geometry.coordinates[1] : 0 }}
        </v-card-text>

        <v-divider />

        <v-card-title> Comment </v-card-title>
        <v-card-text>
          <v-card-text v-text="facility ? facility.properties.comment : ''" />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="remove">Remove</v-btn>
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
  data: () => ({ facility: undefined }),
  props: {
    id: String
  },
  computed: {
    description() {
      if (!this.facility) return
      const allowedLayers = this.$store.state.allowedLayers
      let types = []
      for (const classObj of Object.values(classes))
        for (const layerObj of classObj.layers)
          if (this.facility.properties.layer === layerObj.layer && allowedLayers.includes(layerObj.layer))
            return layerObj.description
    },
    relations() {
      return this.facility.relations
    },
    ls() {
      return this.$store.state.ls
    }
  },

  fetchOnServer: false,

  async fetch() {
    const config = this.getAuthConfig()
    const res = await this.$axios.get(`/api/facility?id=${this.id}`, config)
    const facility = res.data[0]
    this.facility = facility
    if (process.env.dev) console.log('Editing is', facility)
  },

  methods: {
    async remove() {
      this.$store.dispatch('remove', this.id)
    }
  }
}
</script>

<style></style>
