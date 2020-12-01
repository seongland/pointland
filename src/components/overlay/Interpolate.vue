<template>
  <v-row align="center" justify="center">
    <v-col lg="6" md="8" sm="12">
      <v-card class="elevation-24">
        <v-card-actions>
          <v-card-title> Interpolate </v-card-title>
          <v-spacer />
          <v-switch label="Reset Interval" v-model="interval" dense class="mx-3"></v-switch>
        </v-card-actions>
        <v-divider />

        <!-- Count -->
        <v-tooltip top v-if="interval">
          <template v-slot:activator="{ on, attrs }">
            <v-card-text>
              <v-select
                class="pt-0 mt-9"
                label="Interval"
                outlined
                v-on="on"
                rows="2"
                v-model="count"
                :items="insert"
                placeholder="추가정보"
              />
            </v-card-text>
          </template>
          <span>예외사항이나 추가적인 정보를 상세히 기입합니다</span>
        </v-tooltip>

        <v-card-actions>
          <v-checkbox label="Z - Only" dense class="mx-3" v-model="zonly"></v-checkbox>
          <v-spacer />
          <v-btn class="mr-3" @click="apply">Apply</v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data: () => ({ count: undefined, insert: new Array(10).fill().map((_, i) => i), interval: false, zonly: true }),
  props: {},
  computed: {},
  watch: {},
  mounted() {},
  methods: {
    apply() {
      console.log(this.count, this.interval, this.zonly)
    }
  }
}
</script>

<style></style>
