<template>
  <v-row align="center" justify="center">
    <v-col lg="6" md="8" sm="12">
      <v-card class="elevation-24">
        <!-- Geometry -->
        <v-card-title>
          {{ facility.geometry.type }}
          {{ facility.index !== undefined ? `- ` + facility.index : '' }}
          {{ facility.index2 !== undefined ? `- ` + facility.index2 : '' }}
        </v-card-title>
        <v-divider />

        <!-- Properties -->
        <v-card-title v-text="`Properties`" />

        <!-- Layer -->
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-select
              class="mx-2"
              label="Layer"
              solo
              return-object
              dense
              v-bind="attrs"
              v-on="on"
              v-model="targetLayer"
              :items="sameTypes"
              item-text="description"
              item-value="description"
            />
          </template>
          <span>시설물의 종류를 변경합니다</span>
        </v-tooltip>

        <!-- Properties -->
        <div v-for="[name, object] in Object.entries(targetLayer.attributes)" :key="name">
          <v-tooltip top v-if="object.method === 'select'">
            <template v-slot:activator="{ on, attrs }">
              <v-select
                class="mx-2"
                :label="name"
                solo
                dense
                v-bind="attrs"
                v-on="on"
                :items="object.candidates"
                item-text="description"
                item-value="data"
                v-model="facility.properties[name]"
                clearable
                :placeholder="object.placeholder"
              >
                <template v-slot:item="{ item }">
                  <v-img v-if="item.url" :src="item.url" max-width="50" min-width="50" class="mr-3" />
                  {{ item.description }}
                </template>
              </v-select>
            </template>
            <span>{{ object.tooltip }}</span>
          </v-tooltip>

          <v-tooltip top v-else-if="object.method === 'type'">
            <template v-slot:activator="{ on, attrs }">
              <v-card-text>
                <v-text-field
                  class="pt-0 mt-0"
                  :label="name"
                  v-bind="attrs"
                  v-on="on"
                  v-model="facility.properties[name]"
                  :placeholder="object.placeholder"
                />
              </v-card-text>
            </template>
            <span>{{ object.tooltip }}</span>
          </v-tooltip>

          <v-tooltip top v-else-if="object.method === 'relate'">
            <template v-slot:activator="{ on, attrs }">
              <v-row align="center" justify="space-around">
                <v-btn outlined class="mx-3 mb-5" v-bind="attrs" v-on="on" @click="relateFacility(name, object.target)">
                  {{ facility.properties[name] ? facility.properties[name] : object.placeholder }}
                </v-btn>
              </v-row>
            </template>
            <span>{{ object.tooltip }}</span>
          </v-tooltip>

          <v-tooltip top v-else-if="object.method === 'multirelate'">
            <template v-slot:activator="{ on, attrs }">
              <v-row align="center" justify="space-around">
                <v-select
                  multiple
                  outlined
                  class="mx-3 mb-5"
                  v-bind="attrs"
                  v-on="on"
                  @click="relateFacility(name, object.target)"
                >
                  {{ object.placeholder }}
                </v-select>
                {{ facility.properties[name] }}
              </v-row>
            </template>
            <span>{{ object.tooltip }}</span>
          </v-tooltip>

          <!-- Inner  Properties -->
          <div v-for="[prop, sub] in innerProps(facility, object, name)" :key="prop">
            <v-tooltip top v-if="sub.method === 'select'">
              <template v-slot:activator="{ on, attrs }">
                <v-select
                  class="mx-2"
                  :label="prop"
                  solo
                  dense
                  :items="sub.candidates"
                  item-text="description"
                  v-bind="attrs"
                  v-on="on"
                  item-value="data"
                  :placeholder="sub.placeholder"
                  v-model="facility.properties[prop]"
                  clearable
                >
                  <template v-slot:item="{ item }">
                    <v-img v-if="item.url" :src="item.url" max-width="50" min-width="50" class="mr-3" />
                    {{ item.description }}
                  </template>
                </v-select>
              </template>
              <span>{{ sub.tooltip }}</span>
            </v-tooltip>
          </div>
        </div>

        <!-- Comment -->
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-card-text>
              <v-textarea
                class="pt-0 mt-0"
                label="Comment"
                v-bind="attrs"
                outlined
                v-on="on"
                rows="2"
                v-model="comment"
                placeholder="추가정보"
              />
            </v-card-text>
          </template>
          <span>예외사항이나 추가적인 정보를 상세히 기입합니다</span>
        </v-tooltip>

        <!-- Actions -->
        <v-card-actions>
          <v-checkbox v-model="facility.relations.proped" label="속성값 입력 완료" dense class="mx-2"></v-checkbox>
          <v-checkbox v-model="facility.relations.located" label="위치 보정 완료" dense class="mx-2"></v-checkbox>
          <v-checkbox v-model="facility.relations.related" label="시설물 연결 완료" dense class="mx-2"></v-checkbox>
          <v-checkbox v-model="facility.relations.reported" label="추가 데이터 필요" dense class="mx-2"></v-checkbox>
          <v-spacer></v-spacer>
          <v-btn class="mr-2" :loading="$store.state.submit.loading" @click="submit">Submit</v-btn>
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
    facility() {
      return this.$store.state.selected[0]
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

    innerProps(facility, object, name) {
      if (facility.properties[name] === undefined || !object.candidates) return []
      const target = object.candidates.filter(c => c.data === facility.properties[name])[0]
      if (!target?.attributes) return []
      return Object.entries(target.attributes)
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
