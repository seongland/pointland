<template>
  <v-row align="center" justify="center">
    <v-col lg="6" md="8" sm="12">
      <v-card class="elevation-24" v-if="facility.id">
        <v-card-title>
          {{ facility.geometry.type }}
          {{ facility.index !== undefined ? `- ` + facility.index : '' }}
          {{ facility.index2 !== undefined ? `- ` + facility.index2 : '' }}
        </v-card-title>
        <v-divider />
        <v-card-text class="pb-0">
          <span style="font-weight: bold">Maked : </span> {{ createdAt }} - <span style="font-weight: bold">Maker : </span>
          {{ createdBy }}
        </v-card-text>

        <v-card-text class="pt-0">
          <span style="font-weight: bold">Edited : </span> {{ editedAt }} - <span style="font-weight: bold">Editor : </span>
          {{ editedBy }}
        </v-card-text>
        <v-divider />

        <!-- Properties -->
        <v-card-title> Properties </v-card-title>

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

          <v-tooltip top v-else-if="object.method === 'relate'">
            <template v-slot:activator="{ on, attrs }">
              <v-card-text class="pb-0" style="color: #b0b0b0">
                {{ name }}
              </v-card-text>
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
                <v-combobox
                  outlined
                  v-model="facility.properties[name]"
                  multiple
                  :items="facility.properties[name]"
                  class="mx-8 mb-0"
                  :label="name"
                  v-bind="attrs"
                  small-chips
                  readonly
                  v-on="on"
                  @click:append-outer="relateFacility(name, object.target)"
                  append-outer-icon="$plus"
                >
                </v-combobox>
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

        <v-card-actions>
          <v-checkbox v-model="facility.relations.proped" label="속성값 입력 완료" dense class="mx-2"></v-checkbox>
          <v-checkbox v-model="facility.relations.located" label="위치 보정 완료" dense class="mx-2"></v-checkbox>
          <v-checkbox v-model="facility.relations.related" label="시설물 연결 완료" dense class="mx-2"></v-checkbox>
          <v-checkbox v-model="facility.relations.reported" label="추가 데이터 필요" dense class="mx-2"></v-checkbox>
          <v-spacer></v-spacer>
          <v-btn @click="edit" class="mr-2">Apply</v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import consola from 'consola'

const DFT_USER = 'stryx@stryx.co.kr'

export default {
  data: () => ({ facility: { properties: {} }, createdBy: undefined, editedBy: undefined }),
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
        let types = []
        for (const classObj of Object.values(this.groups))
          for (const layerObj of classObj.layers)
            if (this.facility.properties.layer === layerObj.layer) return layerObj.description
      },
      set() {}
    },
    targetLayer: {
      get() {
        if (!this.facility.id) return { attributes: {} }
        for (const classObj of Object.values(this.groups))
          for (const layerObj of classObj.layers)
            if (this.facility.properties.layer === layerObj.layer) {
              this.description = layerObj.description
              consola.info('targetLayer', layerObj)
              return layerObj
            }
      },
      set(layerObj) {
        this.description = layerObj.description
        this.facility.properties.layer = layerObj.layer
        return layerObj
      }
    },
    relations() {
      return this.facility.relations
    },
    ls() {
      return this.$store.state.ls
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
    const facility = this.$store.state.selected[0]
    this.facility = facility

    // Get Drawer
    if (facility.created_by)
      get(`/api/user?id=${facility.created_by}`, config).then(res => (this.createdBy = res.data[0].email))
    else this.createdBy = DFT_USER
    if (facility.edited_by)
      get(`/api/user?id=${facility.edited_by}`, config).then(res => (this.editedBy = res.data[0].email))
    else this.editedBy = DFT_USER

    if (process.env.dev) consola.info('Editing is', facility)
  },

  methods: {
    innerProps(facility, object, name) {
      if (facility.properties[name] === undefined || !object.candidates) return []
      const target = object.candidates.filter(c => c.data === facility.properties[name])[0]
      if (!target?.attributes) return []
      return Object.entries(target.attributes)
    },

    async edit() {
      this.$store.dispatch('edit', this.facility)
    },

    async relateFacility(property, layer) {
      const commit = await this.$store.commit
      const state = await this.$store.state
      commit('setState', { props: ['edit', 'show'], value: false })
      commit('setState', { props: ['edit', 'target'], value: property })
      this.drawnFacilities(state.ls.currentMark, layer)
    }
  }
}
</script>

<style></style>
