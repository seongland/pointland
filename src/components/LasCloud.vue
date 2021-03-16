/* * @summary - vue point cloud componen */

<template>
  <div>
    <div id="nipple" v-if="touchable()" />
    <div id="las" />
  </div>
</template>

<script>
import nipplejs from 'nipplejs'

export default {
  data: () => ({
    lasList: [],
    apiList: [],
    loading: false,
    move: {
      camera: false,
      vertical: false,
      target: false
    }
  }),

  computed: {},

  watch: {},

  methods: {
    touchable: () => window.orientation !== undefined,

    nippleEvent(manager, cloud) {
      manager.on('added', (e, nipple) => {
        if (nipple.position.y < window.innerHeight / 2) this.verticalNipple(nipple, cloud)
        else if (nipple.position.x < window.innerWidth / 2) this.cameraNipple(nipple, cloud)
        else this.targetNipple(nipple, cloud)
      })
    },

    cameraNipple(nipple, cloud) {
      let loop
      let factor = 1
      nipple.on('move', (_, data) => {
        if (loop) clearInterval(loop)
        loop = setInterval(() => {
          cloud.camera.controls.truck((data.force * data.vector.x) / 10, 0, false)
          cloud.camera.controls.forward((data.force * data.vector.y) / 10, false)
          data.vector.x /= factor
          data.vector.y /= factor
        }, 10)
      })
      nipple.on('end', () => {
        factor = 1.1
      })
      nipple.on('destroyed', () => {
        if (loop) clearInterval(loop)
      })
    },

    verticalNipple(nipple, cloud) {
      let loop
      let factor = 1
      nipple.on('move', (_, data) => {
        if (loop) clearInterval(loop)
        loop = setInterval(() => {
          cloud.camera.controls.truck(0, -(data.force * data.vector.y) / 10, false)
          data.vector.x /= factor
          data.vector.y /= factor
        }, 10)
      })
      nipple.on('end', () => {
        factor = 1.1
      })
      nipple.on('destroyed', () => {
        if (loop) clearInterval(loop)
      })
    },

    targetNipple(nipple, cloud) {
      let loop
      let factor = 1
      nipple.on('move', (_, data) => {
        if (loop) clearInterval(loop)
        loop = setInterval(() => {
          cloud.camera.controls.rotate(-(data.force * data.vector.x) / 200, (data.force * data.vector.y) / 200, false)
          data.vector.x /= factor
          data.vector.y /= factor
        }, 10)
      })
      nipple.on('end', () => {
        factor = 1.1
      })
      nipple.on('destroyed', () => {
        if (loop) clearInterval(loop)
      })
    }
  },

  mounted() {
    const cloud = this.initCloud(this.cloudOpt)
    this.$root.cloud = cloud
    const zone = document.getElementById('nipple')
    if (!zone) return
    const options = { zone, multitouch: true, maxNumberOfNipples: 2 }
    const manager = nipplejs.create(options)
    this.nippleEvent(manager, cloud)
  }
}
</script>

<style>
#las,
#nipple {
  height: 100%;
  width: 100%;
  position: absolute;
}
#nipple {
  z-index: 1;
}
</style>
