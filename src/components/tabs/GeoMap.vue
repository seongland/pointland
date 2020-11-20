<template>
  <div>
    <div id="ol" />
    <div id="naver" />
    <v-dialog :absolute="true" :value="overlay" :z-index="1000" @keydown.esc="overlay = false">
      <overlay-pcd />
    </v-dialog>
  </div>
</template>

<script>
export default {
  computed: {
    projects() {
      return this.$store.state.ls?.user?.projects ?? []
    }
  },
  data: () => ({ overlay: false }),
  mounted() {
    if (this.projects.length > 0) {
      const ls = this.$store.state.ls
      let project

      // if settled
      if (ls.prj)
        for (const prj of this.projects) if (prj.id === ls.prjId && prj.layers.tiff && layers.recorded) project = prj

      // filter
      for (const prj of this.projects) if (prj.layers.tiff) project = prj
      if (!project) project = this.projects[0]
      if (process.env.dev) console.log('Project is', project)
      this.$root.map = this.olInit(this.mapOpt, project.geoserver, project.workspace, project.layers)
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
  user-select: none;
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
