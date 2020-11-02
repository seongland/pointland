<template>
  <v-row align="center" justify="center">
    <v-col lg="6" md="8" sm="12">
      <v-card class="elevation-24" v-if="facility.id">
        <v-card-title v-text="facility.geometry.type" />
        <v-divider />
        <v-card-text class="pb-0">
          <span style="font-weight: bold">Maked : </span> {{ createdAt }} - <span style="font-weight: bold">Maker : </span>
          {{ createdBy }}
        </v-card-text>

        <v-card-text class="py-0">
          <span style="font-weight: bold">Edited : </span> {{ editedAt }} - <span style="font-weight: bold">Editor : </span>
          {{ editedBy }}
        </v-card-text>

        <!-- Geometry -->
        <v-card-text class="py-0">
          <span style="font-weight: bold">X : </span> {{ facility.properties.x }} -
          <span style="font-weight: bold">Y : </span> {{ facility.properties.y }} -
          <span style="font-weight: bold">Z : </span> {{ facility.properties.z }}
        </v-card-text>

        <v-card-text class="pt-0">
          <span style="font-weight: bold">Longitude : </span> {{ facility.geometry.coordinates[0] }} -
          <span style="font-weight: bold">Latitude : </span> {{ facility.geometry.coordinates[1] }}
        </v-card-text>

        <v-divider />

        <!-- properties -->
        <v-card-title> Properties </v-card-title>

        <v-card-text class="pt-0" v-if="facility.relations.located || facility.relations.proped">
          <span v-if="facility.relations.located">위치 보정됨</span> -
          <span v-if="facility.relations.proped"> 속성값 입력됨</span>
        </v-card-text>

        <div v-for="[name, object] in Object.entries(targetLayer.attributes)" :key="name">
          <v-card-text class="py-0" v-if="facility.properties[name] !== undefined && object.candidates">
            <span style="font-weight: bold">{{ object.placeholder }} </span> -
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
              <span style="font-weight: bold">{{ sub.placeholder }} </span> -
              {{ sub.candidates.filter(c => c.data === facility.properties[prop])[0].description }}
            </v-card-text>
          </div>
        </div>

        <!-- Comment -->
        <v-card-text v-if="facility.properties.comment">
          <span style="font-weight: bold"> 추가정보 </span> -
          {{ facility.properties.comment }}
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
const DFT_USER = 'stryx@stryx.co.kr'

export default {
  data: () => ({ facility: { properties: {} }, createdBy: undefined, editedBy: undefined }),
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
    },
    createdAt() {
      if (!this.facility.created_at) return
      const date = new Date(Date.parse(this.facility.created_at))
      const full = date.toString()
      const list = full.split(' ')
      return list.splice(0, 5).reduce((pre, post) => `${post} ${pre}`)
    },
    editedAt() {
      if (!this.facility.edited_at) return
      const date = new Date(Date.parse(this.facility.edited_at))
      const full = date.toString()
      const list = full.split(' ')
      return list.splice(0, 5).reduce((pre, post) => `${post} ${pre}`)
    }
  },

  fetchOnServer: false,

  async fetch() {
    const get = this.$axios.get
    const config = this.getAuthConfig()
    const res = await get(`/api/facility?id=${this.id}`, config)
    const facility = res.data[0]
    this.facility = facility

    // Get Drawer
    if (facility.created_by)
      get(`/api/user?id=${facility.created_by}`, config).then(res => (this.createdBy = res.data[0].email))
    else this.createdBy = DFT_USER
    if (facility.edited_by)
      get(`/api/user?id=${facility.edited_by}`, config).then(res => (this.editedBy = res.data[0].email))
    else this.editedBy = DFT_USER
  },

  methods: {
    async remove() {
      this.$store.dispatch('remove', this.id)
    }
  }
}
</script>

<style></style>
