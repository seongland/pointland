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
import OverlayPcd from '~/components/cloud/OverlayPcd'

export default {
  components: {
    OverlayPcd
  },
  computed: {
    projects() {
      return this.$store.state.localStorage?.user?.projects ?? []
    }
  },
  data: () => ({ overlay: false }),
  methods: {},
  mounted() {
    if (this.projects.length > 0) {
      const id = this.projects[0].id
      const prj = this.projects[0].name
      const layers = this.projects[0].layers
      const workspace = this.projects[0].workspace
      const geoserver = this.projects[0].geoserver
      this.olInit(geoserver, workspace, layers)
      this.$nextTick(() => {
        const ping = this.$root.ping
        this.$store.commit('localStorage/setPrj', {
          prj,
          id,
          socket: this.$root.ping
        })
        ping.on('stateResponse', state =>
          this.drawXYs(state.latlngs, state.socketId)
        )
        ping.emit('getStates', this.$store.state.localStorage.prjId)
        ping.on('leave', id => this.subtractVhcl(id))
      })
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
