<template>
  <div id="pcd"></div>
</template>

<script>
import * as THREE from 'three'
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js'

export default {
  data: () => ({
    pointSize: 0.05
  }),
  methods: {
    async initPCD() {
      // camera
      this.camera = new THREE.PerspectiveCamera(60, 1, 1, 10000)

      // scene
      this.scene = new THREE.Scene()
      this.scene.add(this.camera)

      // canvas
      this.canvas = document.getElementById('pcd')
      this.renderer = new THREE.WebGLRenderer({ antialias: true })
      this.renderer.setPixelRatio(window.devicePixelRatio)
      this.renderer.setSize(window.innerWidth, window.innerHeight)
      this.canvas.appendChild(this.renderer.domElement)

      // controls
      this.controls = new TrackballControls(
        this.camera,
        this.renderer.domElement
      )
      this.controls.rotateSpeed = 1.0
      this.controls.zoomSpeed = 1.2
      this.controls.panSpeed = 0.8
      this.controls.staticMoving = true
      this.controls.dynamicDampingFactor = 0.3
      this.controls.minDistance = 0.3
      this.controls.maxDistance = 0.3 * 100
    },

    animate() {
      requestAnimationFrame(this.animate)
      this.controls.update()
      this.renderer.render(this.scene, this.camera)
    },

    drawLas(lasJson) {
      this.loading = true

      const [vertices, colors] = [[], []]
      for (const i in lasJson.x)
        vertices.push(lasJson.x[i], lasJson.y[i], lasJson.z[i])
      for (const i in lasJson.intensity)
        colors.push(
          lasJson.intensity[i] / 256,
          lasJson.intensity[i] / 256,
          lasJson.intensity[i] / 256
        )
      const geometry = new THREE.BufferGeometry()
      geometry.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(vertices, 3)
      )
      geometry.setAttribute(
        'color',
        new THREE.Float32BufferAttribute(colors, 3)
      )
      const material = new THREE.PointsMaterial({
        size: this.pointSize,
        vertexColors: THREE.VertexColors
      })
      const points = new THREE.Points(geometry, material)
      this.controls.target.set(...lasJson.center)
      this.scene.add(points)
      console.log(points)
      this.loading = false
    }
  },
  async fetch() {
    const lasData = await this.$axios(
      '/api/pointcloud/imms_20200824_193802/snap1/22'
    )
    console.log(lasData)
    this.drawLas(lasData.data)
  },
  fetchOnServer: false,
  mounted() {
    this.initPCD()
    this.animate()
  }
}
</script>

<style></style>
