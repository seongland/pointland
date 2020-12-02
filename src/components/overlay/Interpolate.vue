<template>
  <v-row align="center" justify="center">
    <v-col lg="6" md="8" sm="12">
      <v-card class="elevation-24">
        <v-card-actions>
          <v-card-title> Interpolate </v-card-title>
          <v-spacer />
          <v-switch label="Reset Interval" v-model="reset" dense class="mx-3"></v-switch>
        </v-card-actions>
        <v-divider />

        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-card-text>
              <v-select
                class="pt-8 mt-0"
                label="Method"
                outlined
                v-on="on"
                v-model="method"
                item-text="placeholder"
                item-value="name"
                :items="methods"
                placeholder="보간 방법"
              />
            </v-card-text>
          </template>
          <span>보간 방법을 선택합니다</span>
        </v-tooltip>

        <!-- Count -->
        <v-tooltip top v-if="reset">
          <template v-slot:activator="{ on, attrs }">
            <v-card-text>
              <v-select
                class="pt-0 mt-0"
                label="Interval"
                outlined
                v-on="on"
                rows="2"
                v-model="count"
                :items="insert"
                placeholder="사이 점의 개수"
              />
            </v-card-text>
          </template>
          <span>사이에 올 점의 개수를 선택합니다</span>
        </v-tooltip>

        <v-divider />
        <v-card-actions>
          <v-checkbox v-if="!reset" label="Z - Only" dense class="mx-3" v-model="zonly"></v-checkbox>
          <v-spacer />
          <v-btn class="mr-3" @click="apply">Apply</v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import consola from 'consola'
import { xyto84 } from '~/server/api/addon/tool/coor'

export default {
  data: () => ({
    count: 1,
    insert: new Array(10).fill().map((_, i) => i),
    reset: false,
    zonly: true,
    methods: [{ placeholder: '선형보간', name: 'linear' }],
    method: 'linear'
  }),
  props: {},
  computed: {},
  watch: {},
  mounted() {},
  methods: {
    apply() {
      const state = this.$store.state
      const commit = this.$store.commit
      const facility = state.selected[0]
      const geom = facility.geometry

      if (this.method === 'linear')
        if (this.reset) {
          if (geom.type === 'LineString') this.resetLine()
          else if (geom.type === 'Polygon') this.resetPolygon()
        } else {
          if (geom.type === 'LineString') this.interpolateLine()
          else if (geom.type === 'Polygon') this.interpolatePolygon()
        }
      commit('setState', { props: ['interpolating'], value: false })
    },

    interpolateLine() {
      // Default Variables
      const state = this.$store.state
      const facility = state.selected[0]
      const props = facility.properties
      const xyzs = props.xyzs
      const geom = facility.geometry
      const indexes = facility.indexes
      const coors = geom.coordinates

      // Type Variable
      const se = [indexes[0], indexes[indexes.length - 1]]
      const start = Math.min(...se)
      const end = Math.max(...se)

      // For reselect shift
      let index
      if (start === facility.index) index = end
      else if (end === facility.index) index = start

      const count = end - start - 1
      if (count < 1) return
      const idxs = new Array(count).fill().map((_, i) => i + start + 1)
      if (process.env.target === 'facility') consola.info('Interpolating', idxs, start, end)
      if (this.zonly)
        for (const idx of idxs) {
          const ratio = (idx - start) / (end - start)
          const z = xyzs[start][2] + (xyzs[end][2] - xyzs[start][2]) * ratio
          xyzs[idx][2] = z
          coors[idx][2] = z
        }
      else
        for (const idx of idxs) {
          const ratio = (idx - start) / (end - start)
          let xyz = new Array(3).fill()
          xyz = xyz.map((_, i) => xyzs[start][i] + (xyzs[end][i] - xyzs[start][i]) * ratio)
          xyzs[idx] = xyz
          coors[idx] = xyto84(xyz[0], xyz[1])
          coors[idx][2] = xyz[2]
        }
      this.selectFacility(facility, facility.index, index, { shiftKey: true })
    },

    interpolatePolygon() {
      // Default Variables
      const state = this.$store.state
      const facility = state.selected[0]
      const props = facility.properties
      const xyzs = props.xyzs
      const geom = facility.geometry
      const indexes = facility.indexes
      const coors = geom.coordinates

      // Type Variable
      const index = facility.index
      const se = [indexes[0][1], indexes[indexes.length - 1][1]]
      const start = Math.min(...se)
      const end = Math.max(...se)

      // For reselect shift
      let index2
      if (start === facility.index2) index2 = start
      else if (end === facility.index2) index2 = end

      const count = end - start - 1
      if (count < 1) return
      const idxs = new Array(count).fill().map((_, i) => i + start + 1)
      if (process.env.target === 'facility') consola.info('Interpolating', idxs, start, end)

      if (this.zonly)
        for (const idx of idxs) {
          const ratio = (idx - start) / (end - start)
          const z = xyzs[index][start][2] + (xyzs[index][end][2] - xyzs[index][start][2]) * ratio
          xyzs[index][idx][2] = z
          coors[index][idx][2] = z
        }
      else
        for (const idx of idxs) {
          const ratio = (idx - start) / (end - start)
          let xyz = new Array(3).fill()
          xyz = xyz.map((_, i) => xyzs[index][start][i] + (xyzs[index][end][i] - xyzs[index][start][i]) * ratio)
          xyzs[index][idx] = xyz
          coors[index][idx] = xyto84(xyz[0], xyz[1])
          coors[index][idx][2] = xyz[2]
        }
      this.selectFacility(facility, index, index2, { shiftKey: true })
    },

    async resetLine() {
      // Default Variables
      const state = this.$store.state
      const facility = state.selected[0]
      const props = facility.properties
      const xyzs = props.xyzs
      const geom = facility.geometry
      const indexes = facility.indexes
      const coors = geom.coordinates

      // Type Variable
      const se = [indexes[0], indexes[indexes.length - 1]]
      const start = Math.min(...se)
      const end = Math.max(...se)

      const count = this.count
      const idxs = new Array(count).fill().map((_, i) => i + start + 1)
      if (process.env.target === 'facility') consola.info('Interpolating', idxs, start, end)

      // make array
      let insertXYZs = []
      let insertCoors = []
      for (const idx of idxs) {
        const ratio = (idx - start) / (count + 1)
        let xyz = new Array(3).fill()
        xyz = xyz.map((_, i) => xyzs[start][i] + (xyzs[end][i] - xyzs[start][i]) * ratio)
        insertXYZs.push(xyz)
        let coor = xyto84(xyz[0], xyz[1])
        coor[2] = xyz[2]
        insertCoors.push(coor)
      }

      // insert
      xyzs.splice(start + 1, end - start - 1)
      xyzs.splice(start + 1, 0, ...insertXYZs)
      coors.splice(start + 1, end - start - 1)
      coors.splice(start + 1, 0, ...insertCoors)

      await this.selectFacility(facility, start, 0, { shiftKey: true })
      this.selectFacility(facility, start + count + 1, 0, { shiftKey: true })
    },

    async resetPolygon() {
      // Default Variables
      const state = this.$store.state
      const facility = state.selected[0]
      const props = facility.properties
      const xyzs = props.xyzs
      const geom = facility.geometry
      const indexes = facility.indexes
      const coors = geom.coordinates

      // Type Variable
      const index = facility.index
      const se = [indexes[0][1], indexes[indexes.length - 1][1]]
      const start = Math.min(...se)
      const end = Math.max(...se)

      // For reselect shift
      let index2
      if (start === facility.index2) index2 = start
      else if (end === facility.index2) index2 = end

      const count = this.count
      const idxs = new Array(count).fill().map((_, i) => i + start + 1)
      if (process.env.target === 'facility') consola.info('Interpolating', idxs, start, end)

      // make array
      let insertXYZs = []
      let insertCoors = []
      for (const idx of idxs) {
        const ratio = (idx - start) / (count + 1)
        let xyz = new Array(3).fill()
        xyz = xyz.map((_, i) => xyzs[index][start][i] + (xyzs[index][end][i] - xyzs[index][start][i]) * ratio)
        insertXYZs.push(xyz)
        let coor = xyto84(xyz[0], xyz[1])
        coor[2] = xyz[2]
        insertCoors.push(coor)
      }

      // insert
      xyzs[index].splice(start + 1, end - start - 1)
      xyzs[index].splice(start + 1, 0, ...insertXYZs)
      coors[index].splice(start + 1, end - start - 1)
      coors[index].splice(start + 1, 0, ...insertCoors)

      await this.selectFacility(facility, index, start, { shiftKey: true })
      this.selectFacility(facility, index, start + count + 1, { shiftKey: true })
    }
  }
}
</script>

<style></style>
