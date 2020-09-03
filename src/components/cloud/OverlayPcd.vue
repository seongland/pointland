<template>
  <div id="pcd"></div>
</template>

<script>
import * as THREE from 'three'
import { PCDLoader } from 'three/examples/jsm/loaders/PCDLoader.js'
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js'

export default {
  methods: {
    async initPCD() {
      // camera
      this.camera = new THREE.PerspectiveCamera(5, 1, 1, 10000)
      this.camera.up.set(5, 0, 5)

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
      this.controls.rotateSpeed = 2.0
      this.controls.zoomSpeed = 0.3
      this.controls.panSpeed = 0.2
      this.controls.staticMoving = true
      this.controls.minDistance = 0.3
      this.controls.maxDistance = 0.3 * 100

      //loader
      const loader = new PCDLoader()
      await loader.load(
        'https://threejs.org/examples/models/pcd/binary/Zaghetto.pcd',
        points => {
          const center = points.geometry.boundingSphere.center
          this.controls.target.set(center.x, center.y, center.z)
          this.controls.update()
          this.scene.add(points)
        }
      )
    },
    animate() {
      requestAnimationFrame(this.animate)
      this.controls.update()
      this.renderer.render(this.scene, this.camera)
    }
  },
  mounted() {
    this.initPCD()
    this.animate()
  }
}
</script>

<style></style>
