<template>
  <v-row align="center" justify="center">
    <v-col lg="6" md="8" sm="12">
      <v-card class="elevation-24">
        <v-card-subtitle class="unselectable pb-0"> Config </v-card-subtitle>
        <v-card-text>
          <v-text-field label="Argument 1" type="text"></v-text-field>

          <v-text-field label="Argument 2" name="password" type="password"></v-text-field>

          <v-text-field label="Argument 3" type="text"></v-text-field>

          <v-text-field label="Argument 4" name="password" type="password"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="$store.dispatch('')">Submit</v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {}
</script>

<style></style>
