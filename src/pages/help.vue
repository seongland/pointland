<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col lg="6" md="8" sm="12">
        <v-card class="elevation-24">
          <v-toolbar dark flat>
            <v-toolbar-title style="font-weight: bold">Help</v-toolbar-title>
          </v-toolbar>

          <!-- 단축키 -->
          <v-expansion-panels>
            <v-expansion-panel>
              <v-expansion-panel-header>
                <v-card-title style="font-weight: bold">What is this page</v-card-title>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-divider />
                <v-card-subtitle>Seongland</v-card-subtitle>
                <v-card-text><kbd>seonglae</kbd> - Seongland is Seonglae's Sandbox Set </v-card-text>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="$router.push('/')">
              Seongland
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'help',
  layout: 'before'
}
</script>
