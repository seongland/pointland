<template>
  <v-app dark>
    <!-- 1. Upper Bar -->
    <v-app-bar :clipped-left="clipped" fixed app dense>
      <v-toolbar-title v-text="title + ' ' + meta.version" />
      <v-spacer />
    </v-app-bar>

    <!-- 3. Main Contents -->
    <v-main>
      <nuxt />
    </v-main>
  </v-app>
</template>

<script>
export default {
  mounted(){
    this.meta.version = process.env.version
  },
  data() {
    return {
      title: '3D MAPPING',
      coor: 'Stryx',
      clipped: true,
      drawer: false,
      fixed: false,
      meta: {
        version: undefined
      },
      miniVariant: false
    }
  }
}
</script>
