<template> </template>

<template>
  <v-navigation-drawer
    right
    width="500px"
    :mini-variant-width="20"
    :mini-variant.sync="mini"
    expand-on-hover
    permanent
    app
    color="grey darken-4"
  >
    <div v-show="!mini && !$store.state.loading">
      <v-list>
        <v-tooltip left>
          <template v-slot:activator="{ on, attrs }">
            <v-list-item
              ><v-select
                attach
                clearable
                class="mt-5"
                v-model="targetTask"
                v-bind="attrs"
                v-on="on"
                solo
                dense
                label="작업 타겟"
                :items="filters"
                item-text="label"
                item-value="task"
            /></v-list-item>
          </template>
          <span>작업 목표를 설정하여 시설물을 필터링합니다</span>
        </v-tooltip>
      </v-list>

      <v-divider></v-divider>

      <v-list><v-data-table class="mx-5" @click:row="clickRow" :headers="headers" :items="items" /> </v-list>

      <v-divider></v-divider>

      <v-card class="mx-5 my-2">
        <v-card-text>속성값 입력 필요 - {{ items.filter(item => !item.relations.proped).length }} </v-card-text>
        <v-card-text>위치보정 필요 - {{ items.filter(item => !item.relations.located).length }} </v-card-text>
      </v-card>
    </div>
  </v-navigation-drawer>
</template>

<script>
import { ref as imgRef } from '~/plugins/image/init'

export default {
  data: () => ({
    show: false,
    mini: false,
    filters: [
      { label: '속성값 입력', task: { data: false, prop: 'proped' } },
      { label: '위치보정', task: { data: false, prop: 'located' } }
    ],
    headers: [
      { text: 'Index', value: 'index' },
      { text: 'Layer', value: 'properties.layer' },
      { text: '속성입력', value: 'relations.proped' },
      { text: '위치보정', value: 'relations.located' }
    ]
  }),
  computed: {
    items() {
      return this.$store.state.facilities.map((item, index) => ({ ...item, index: index + 1 }))
    },
    targetTask: {
      get() {
        return this.$store.state.ls.targetTask
      },
      set(targetTask) {
        this.$store.commit('setState', { props: ['ls', 'targetTask'], value: targetTask })
        this.drawnFacilities(this.$store.state.ls.currentMark, imgRef.depth)
      }
    }
  },
  watch: {
    mini(mini) {
      const mapWrapper = document.getElementById('global-map')?.parentElement
      if (!mapWrapper) return
      if (mini) mapWrapper.classList.remove('left')
      else mapWrapper.classList.add('left')
    }
  },
  methods: {
    clickRow(facility) {
      this.selectFacility(facility)
    }
  }
}
</script>
