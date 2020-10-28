<template>
  <v-row align="center" justify="center">
    <v-col lg="6" md="8" sm="12">
      <v-card class="elevation-24">
        <v-card-title v-text="description" />
        <v-divider />
        <v-card-title> {{ facility ? facility.geometry.type : '' }} </v-card-title>
        <v-card-text class="py-0">
          <span style="font-weight: bold">X : </span> {{ facility ? facility.properties.x : 0 }} -
          <span style="font-weight: bold">Y : </span> {{ facility ? facility.properties.y : 0 }} -
          <span style="font-weight: bold">Z : </span> {{ facility ? facility.properties.z : 0 }}
        </v-card-text>

        <v-card-text class="pt-0">
          <span style="font-weight: bold">Longitude : </span> {{ facility ? facility.geometry.coordinates[0] : 0 }} -
          <span style="font-weight: bold">Latitude : </span> {{ facility ? facility.geometry.coordinates[1] : 0 }}
        </v-card-text>

        <v-divider />

        <v-card-title> Properties </v-card-title>
        <v-select
          class="mx-2"
          label="Layer"
          solo
          return-object
          dense
          v-model="targetLayer"
          :items="sameTypes"
          item-text="description"
          item-value="description"
        ></v-select>
        <v-card-text>
          <v-text-field label="Comment" v-model="comment" />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="edit">Apply</v-btn>
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
    comment: {
      get() {
        return this.facility ? this.facility.properties.comment : ''
      },
      set(value) {
        this.facility.properties.comment = value
      }
    },
    description: {
      get() {
        if (!this.facility) return
        const allowedLayers = this.$store.state.allowedLayers
        let types = []
        for (const classObj of Object.values(classes))
          for (const layerObj of classObj.layers)
            if (this.facility.properties.layer === layerObj.layer && allowedLayers.includes(layerObj.layer))
              return layerObj.description
      },
      set() {}
    },
    targetLayer: {
      get() {
        if (!this.facility) return
        for (const classObj of Object.values(classes))
          for (const layerObj of classObj.layers)
            if (this.facility.properties.layer === layerObj.layer) {
              this.description = layerObj.description
              return layerObj
            }
      },
      set(layerObj) {
        this.description = layerObj.description
        this.facility.properties.layer = layerObj.layer
        return layerObj
      }
    },
    sameTypes() {
      if (!this.facility) return []
      const allowedLayers = this.$store.state.allowedLayers
      let types = []
      for (const classObj of Object.values(classes))
        for (const layerObj of classObj.layers)
          if (this.facility.geometry.type === layerObj.type && allowedLayers.includes(layerObj.layer)) types.push(layerObj)
      return types
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
    async edit() {
      this.$store.dispatch('edit', this.facility)
    }
  }
}
</script>

<style></style>
