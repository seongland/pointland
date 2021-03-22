/* * @summary - vue point cloud componen */

<template>
  <div>
    <div id="nipple" v-if="touchable()" />
    <div id="las" />
  </div>
</template>

<script>
import nipplejs from 'nipplejs'

const POSITION = [10, 130, 50]
const EPS = 1e-5

export default {
  data: () => ({
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
    setTimeout(() => this.$store.commit('snack', { message: 'Welcome to Pointland' }), 1000)

    cloud.potree
      .loadPointCloud('cloud.json', url => `/potree/${url}`)
      .then(pco => {
        this.$store.commit('setLoading', false)
        cloud.offset = [pco.position.x, pco.position.y, pco.position.z]
        pco.translateX(-pco.position.x)
        pco.translateY(-pco.position.y)
        pco.translateZ(-pco.position.z)
        cloud.pointclouds.push(pco)
        cloud.scene.add(pco)
        pco.material.intensityRange = [0, 255]
        pco.material.maxSize = 40
        pco.material.minSize = 4
        pco.material.size = 1
        pco.material.shape = 1
        cloud.camera.controls.setTarget(POSITION[0] + 7 * EPS, POSITION[1] - 5 * EPS, POSITION[2] - EPS, true)
        setTimeout(() => this.$store.commit('snack', { message: 'Click Top Left Button for Help', timeout: 10000 }), 10000)
      })
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
