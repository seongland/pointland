<template>
  <div>
    <div id="ol" />
    <div id="naver" />
    <v-dialog
      :absolute="true"
      :value="overlay"
      :z-index="1000"
      @keydown.esc="overlay = false"
    >
      <overlay-pcd />
    </v-dialog>
  </div>
</template>

<script>
export default {
  computed: {
    projects() {
      return this.$store.state.localStorage?.user?.projects ?? []
    }
  },
  data: () => ({ overlay: false }),
  mounted() {
    if (this.projects.length > 0) {
      const localStorage = this.$store.state.localStorage
      let project

      // if settled
      if (localStorage.prj)
        for (const prj of this.projects) {
          if (prj.id === localStorage.prjId) project = prj
        }
      else project = this.projects[0]
      this.olInit(project.geoserver, project.workspace, project.layers)
    }
  },

  methods: {
    pingFlag() {
      return this.$root.ping
    }
  }
}
</script>

<style>
#ol,
#naver {
  height: 100%;
  width: 100%;
  position: absolute !important;
  z-index: 1;
}
#naver {
  z-index: 0;
}
.ol-zoom {
  top: unset !important;
  bottom: 1.6em !important;
  left: 1em;
}
.ol-zoom-in,
.ol-zoom-out {
  background-color: #646464 !important;
  opacity: 1 !important;
}
</style>
