<template>
  <v-row align="center" justify="center">
    <v-col lg="6" md="8" sm="12">
      <v-card class="elevation-24">
        <v-card-title v-text="description" />
        <v-divider />
        <v-card-title> {{ selected[0].geometry.type }}</v-card-title>
        <v-card-text class="py-0">
          <span style="font-weight: bold">X : </span> {{ selected[0].properties.x }} -
          <span style="font-weight: bold">Y : </span> {{ selected[0].properties.y }} -
          <span style="font-weight: bold">Z : </span> {{ selected[0].properties.z }}
        </v-card-text>

        <v-card-text class="pt-0">
          <span style="font-weight: bold">Longitude : </span> {{ selected[0].geometry.coordinates[0] }} -
          <span style="font-weight: bold">Latitude : </span> {{ selected[0].geometry.coordinates[1] }}
        </v-card-text>

        <v-divider />

        <v-card-title v-text="`Properties`" />

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
            clearable
            item-value="data"
            :placeholder="object.placeholder"
            v-model="selected[0].properties[name]"
          >
            <template v-slot:item="{ item }">
              <v-img :src="item.url" max-width="50" min-width="50" class="mr-3" />
              {{ item.description }}
            </template></v-select
          >
          <v-card-text v-else-if="object.method === 'type'">
            <v-text-field
              class="pt-0 mt-0"
              :label="name"
              v-model="selected[0].properties[name]"
              :placeholder="object.placeholder"
            />
          </v-card-text>

          <!-- Inner  Properties -->
          <div
            v-for="[prop, sub] in selected[0].properties[name] !== undefined && object.candidates
              ? Object.entries(
                  object.candidates.filter(c => c.data === selected[0].properties[name])[0].attributes
                    ? object.candidates.filter(c => c.data === selected[0].properties[name])[0].attributes
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
              :placeholder="sub.placeholder"
              clearable
              v-model="selected[0].properties[prop]"
            >
              <template v-slot:item="{ item }">
                <v-img :src="item.url" max-width="50" min-width="50" class="mr-3" />
                {{ item.description }}
              </template></v-select
            >
          </div>
        </div>

        <!-- Comment -->
        <v-card-text>
          <v-text-field label="Comment" class="pt-0 mt-0" v-model="comment" placeholder="추가정보" />
        </v-card-text>
        <v-card-actions>
          <v-checkbox v-model="selected[0].relations.located" label="위치 보정" dense class="mx-2"></v-checkbox>
          <v-checkbox v-model="selected[0].relations.proped" label="속성값 입력" dense class="mx-2"></v-checkbox>
          <v-spacer></v-spacer>
          <v-btn :loading="$store.state.submit.loading" @click="submit">Submit</v-btn>
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
  data: () => ({ comment: undefined, description: undefined, targetLayer: { attributes: {} } }),
  props: {
    layer: String,
    type: String
  },
  computed: {
    relations() {
      return this.$store.state.selected[0].relations
    },
    sameTypes() {
      const allowedLayers = this.$store.state.allowedLayers
      let types = []
      for (const classObj of Object.values(classes))
        for (const layerObj of classObj.layers)
          if (this.type === layerObj.type && allowedLayers.includes(layerObj.layer)) types.push(layerObj)
      return types
    },
    ls() {
      return this.$store.state.ls
    },
    selected: {
      get() {
        return this.$store.state.selected
      },
      set(a, b) {
        console.log(a, b)
      }
    }
  },

  watch: {
    layer(layer) {
      this.updateTarget(layer)
    }
  },

  mounted() {
    this.updateTarget(this.layer)
  },

  methods: {
    async submit() {
      const dispatch = this.$store.dispatch
      dispatch('submit', {
        comment: this.comment,
        type: 'Point',
        args: { layer: this.targetLayer.layer }
      })
    },

    updateTarget(layer) {
      for (const classObj of Object.values(classes))
        for (const layerObj of classObj.layers)
          if (layer === layerObj.layer) {
            this.description = layerObj.description
            this.targetLayer = layerObj
          }
    }
  }
}
</script>

<style></style>
