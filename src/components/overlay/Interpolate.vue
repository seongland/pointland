<template>
  <v-row align="center" justify="center">
    <v-col lg="6" md="8" sm="12">
      <v-card class="elevation-24">
        <!-- Geometry -->
        <v-card-title> </v-card-title>
        <v-divider />

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
                v-model="between"
                placeholder="추가정보"
              />
            </v-card-text>
          </template>
          <span>예외사항이나 추가적인 정보를 상세히 기입합니다</span>
        </v-tooltip>

        <!-- Actions -->
        <v-card-actions>
          <v-checkbox label="속성값 입력 완료" dense class="mx-2"></v-checkbox>
          <v-spacer></v-spacer>
          <v-btn class="mr-2" :loading="$store.state.submit.loading" @click="submit">Submit</v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data: () => ({ between: undefined }),
  props: {},
  computed: {},
  watch: {},
  mounted() {},
  methods: {}
}
</script>

<style></style>
