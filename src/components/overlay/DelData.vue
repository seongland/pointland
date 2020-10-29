<template>
  <v-row align="center" justify="center">
    <v-col lg="6" md="8" sm="12">
      <v-card class="elevation-24">
        <v-card-title v-text="description" />
        <v-divider />
        <v-card-title> {{ facility.id ? facility.geometry.type : '' }}</v-card-title>
        <v-card-text class="py-0">
          <span style="font-weight: bold">X : </span> {{ facility.id ? facility.properties.x : 0 }} -
          <span style="font-weight: bold">Y : </span> {{ facility.id ? facility.properties.y : 0 }} -
          <span style="font-weight: bold">Z : </span> {{ facility.id ? facility.properties.z : 0 }}
        </v-card-text>

        <v-card-text class="pt-0">
          <span style="font-weight: bold">Longitude : </span> {{ facility.id ? facility.geometry.coordinates[0] : 0 }} -
          <span style="font-weight: bold">Latitude : </span> {{ facility.id ? facility.geometry.coordinates[1] : 0 }}
        </v-card-text>

        <v-divider />

        <!-- properties -->
        <v-card-title> Properties </v-card-title>
        <div v-for="[name, object] in Object.entries(targetLayer.attributes)" :key="name">
          <v-card-text v-if="facility.properties[name] !== undefined && object.candidates">
            <span style="font-weight: bold">{{ name }} </span> -
            {{ object.candidates.filter(c => c.data === facility.properties[name])[0].description }}
          </v-card-text>

          <div
            v-for="[prop, sub] in facility.properties[name] && object.candidates
              ? Object.entries(
                  object.candidates.filter(c => c.data === facility.properties[name])[0].attributes
                    ? object.candidates.filter(c => c.data === facility.properties[name])[0].attributes
                    : {}
                )
              : []"
            :key="prop"
          >
            <v-card-text v-if="facility.properties[prop] !== undefined && sub.candidates">
              <span style="font-weight: bold">{{ prop }} </span> -
              {{ sub.candidates.filter(c => c.data === facility.properties[prop])[0].description }}
            </v-card-text>
          </div>
        </div>

        <!-- Comment -->
        <v-card-text>
          <span style="font-weight: bold"> Comment </span> -
          {{ facility.id ? facility.properties.comment : '' }}
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="remove" :loading="$store.state.del.loading">Remove</v-btn>
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
  data: () => ({ facility: { properties: {} } }),
  props: {
    id: String
  },
  computed: {
    description: {
      get() {
        if (!this.facility.id) return
        const allowedLayers = this.$store.state.allowedLayers
        let types = []
        for (const classObj of Object.values(classes))
          for (const layerObj of classObj.layers)
            if (this.facility.properties.layer === layerObj.layer && allowedLayers.includes(layerObj.layer))
              return layerObj.description
      },
      set() {}
    },
    relations() {
      return this.facility.relations
    },
    ls() {
      return this.$store.state.ls
    },
    targetLayer: {
      get() {
        if (!this.facility.id) return { attributes: {} }
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
    }
  },

  fetchOnServer: false,

  async fetch() {
    const config = this.getAuthConfig()
    const res = await this.$axios.get(`/api/facility?id=${this.id}`, config)
    const facility = res.data[0]
    this.facility = facility
  },

  methods: {
    async remove() {
      this.$store.dispatch('remove', this.id)
    }
  }
}
</script>

<style></style>
