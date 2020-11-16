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
    <div v-show="!mini ? !$store.state.loading : false">
      <v-list>
        <v-tooltip left>
          <template v-slot:activator="{ on, attrs }">
            <v-list-item>
              <v-select
                attach
                clearable
                class="mt-5"
                v-model="targetTask"
                v-bind="attrs"
                v-on="on"
                solo
                dense
                label="전체 작업"
                :items="filters"
                item-text="label"
                item-value="task"
              />
              <v-select
                class="mt-5 ml-5"
                attach
                solo
                dense
                v-model="maxDistance"
                label="전체"
                item-text="label"
                item-value="data"
                :items="distances"
              />
            </v-list-item>
          </template>
          <span>작업 목표를 설정하여 시설물을 필터링합니다</span>
        </v-tooltip>
      </v-list>

      <v-divider></v-divider>

      <v-list>
        <v-data-table
          @page-count="pageCount = $event"
          hide-default-footer
          class="mx-5"
          :page.sync="page"
          @click:row="clickRow"
          :headers="headers"
          :items="items"
        >
          <template v-for="h in headers" v-slot:[`header.${h.value}`]="{ header }">
            <v-tooltip top :key="h.value">
              <template v-slot:activator="{ on }">
                <span v-on="on">{{ header.text }}</span>
              </template>
              <span>{{ header.tooltip }}</span>
            </v-tooltip>
          </template>
        </v-data-table>
        <v-pagination v-model="page" :length="pageCount" />
      </v-list>

      <v-divider></v-divider>

      <v-card class="mx-5 my-2">
        <v-card-text v-if="!targetTask || targetTask.prop === 'proped'"
          >속성값 입력 필요 - {{ items.filter(item => !item.relations.proped).length }}
        </v-card-text>
        <v-card-text v-if="!targetTask || targetTask.prop === 'located'"
          >위치보정 필요 - {{ items.filter(item => !item.relations.located).length }}
        </v-card-text>
        <v-card-text v-if="!targetTask || targetTask.prop === 'reported'"
          >추가 데이터 필요 - {{ items.filter(item => item.relations.reported).length }}
        </v-card-text>
      </v-card>
    </div>
  </v-navigation-drawer>
</template>

<script>
import { ref as imgRef } from '~/plugins/image/init'

export default {
  data: () => ({
    page: 1,
    pageCount: 10,
    show: false,
    mini: false,
    filters: [
      { label: '속성값 입력', task: { data: false, prop: 'proped' } },
      { label: '위치보정', task: { data: false, prop: 'located' } },
      { label: '추가 데이터 필요', task: { data: true, prop: 'reported' } }
    ],
    distances: [
      { label: '50m', data: 50 },
      { label: '500m', data: 500 },
      { label: '전체', data: 0 }
    ],
    headers: [
      { align: 'center', text: '참조', value: 'index' },
      { align: 'center', text: '레이어', value: 'properties.layer' },
      { align: 'center', text: '이미지', value: 'relations.visible', tooltip: '시야각 내 확인 가능' },
      { align: 'center', text: '속성입력', value: 'relations.proped', tooltip: '속성값 입력 완료' },
      { align: 'center', text: '위치보정', value: 'relations.located', tooltip: '위치 보정 완료' }
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
        this.drawnFacilities(this.$store.state.ls.currentMark)
      }
    },
    maxDistance: {
      get() {
        return this.$store.state.distance.max
      },
      set(value) {
        this.$store.commit('setState', { props: ['distance', 'max'], value })
        this.drawnFacilities(this.$store.state.ls.currentMark)
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
