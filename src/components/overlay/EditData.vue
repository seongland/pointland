<template>
  <v-row align="center" justify="center">
    <v-col lg="6" md="8" sm="12">
      <v-card class="elevation-24">
        <v-card-title v-text="description" />
        <v-divider />
        <v-card-title> {{ facility.id ? facility.geometry.type : '' }} </v-card-title>
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
        />

        <!-- properties -->
        <div v-for="[name, object] in Object.entries(targetLayer.attributes)" :key="name">
          <v-select
            class="mx-2"
            :label="name"
            solo
            dense
            v-if="object.method === 'select'"
            :items="object.candidates"
            item-text="description"
            item-value="data"
            v-model="facility.properties[name]"
          >
          </v-select>
          <v-card-text v-else-if="object.method === 'type'">
            <v-text-field class="pt-0 mt-0" :label="name" v-model="facility.properties[name]" />
          </v-card-text>

          <!-- Inner  Properties -->
          <div
            v-for="[prop, sub] in facility.properties[name] !== undefined && object.candidates
              ? Object.entries(
                  object.candidates.filter(c => c.data === facility.properties[name])[0].attributes
                    ? object.candidates.filter(c => c.data === facility.properties[name])[0].attributes
                    : {}
                )
              : []"
            :key="prop"
          >
            <v-select
              class="mx-2"
              :label="prop"
              solo
              dense
              v-if="sub.method === 'select'"
              :items="sub.candidates"
              item-text="description"
              item-value="data"
              v-model="facility.properties[prop]"
            >
              <template v-slot:item="{ item }">
                <img :src="item.url" />
                {{ item.description }}
              </template>
            </v-select>
          </div>
        </div>

        <!-- Comment -->
        <v-card-text>
          <v-text-field class="pt-0 mt-0" label="Comment" v-model="comment" />
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
  data: () => ({ facility: { properties: {} } }),
  props: {
    id: String
  },
  computed: {
    comment: {
      get() {
        return this.facility.id ? this.facility.properties.comment : ''
      },
      set(value) {
        this.facility.properties.comment = value
      }
    },
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
    },
    sameTypes() {
      if (!this.facility.id) return []
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
