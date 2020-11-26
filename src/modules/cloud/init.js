/**
 * @summary - Make Point Cloud
 */

import * as THREE from 'three'
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js'
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js'
import { drawHover, click3D } from './draw'
import { makePointLayer } from './layer'

export const ref = { cloud: null, cloudSize: 0.05, pointSize: 1, lineWidth: 0.01 }

function initCloud(cloudOpt) {
  /**
   * @summary - Make Point Cloud
   * @params {String} id - dom id for append
   * @params {Object} socket - socket io object to render real time
   */
  const cloud = { points: [], lines: [], loops: [] }
  cloud.el = document.getElementById('las')
  if (cloud.el && window) {
    // Make Space
    cloud.opt = cloudOpt
    cloud.camera = makeCamera(cloud.el)
    cloud.scene = makeScene(cloud.camera)
    cloud.renderer = makeRenderer(cloud.el)
    cloud.el.appendChild(cloud.renderer.domElement)
    cloud.el.cloud = cloud
    cloud.controls = makeControls(cloud.camera, cloud.renderer)
    cloud.transform = makeTransform(cloud.camera, cloud.renderer, cloud.scene)
    cloud.axis = true
    cloud.mouse = new THREE.Vector2()
    cloud.raycaster = new THREE.Raycaster()
    ref.cloud = cloud
    ref.cloud.selectCallback = cloudOpt.selectCallback
    window.addEventListener('resize', onWindowResize, false)
    cloud.el.addEventListener('mousemove', onDocumentMouseMove, false)
    cloud.el.addEventListener('dblclick', click3D, false)

    for (const config of cloudOpt.pointLayers) cloud.scene.add(makePointLayer(config))

    // Add To Canvas
    cloud.id = animate()
    return cloud
  } else throw new Error('No Window or No #cloud')
}

function purgeCloud(cloud) {
  /**
   * @summary - Purge cloud event, loop
   */
  window.removeEventListener('resize', onWindowResize, false)
  cancelAnimationFrame(cloud.id)
  return null
}

export function updateCtrl() {
  /**
   * @summary - Make Controls
   */
  if (ref.updated) return
  const camera = ref.cloud.camera
  const renderer = ref.cloud.renderer
  ref.cloud.controls = makeControls(camera, renderer)
  ref.updated = true
}

function makeCamera(el) {
  /**
   * @summary - Make Camera
   */
  const w = el.offsetWidth
  const h = el.offsetHeight
  const camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 10000)
  camera.position.z = 3
  return camera
}

function makeScene(cam) {
  /**
   * @summary - Make Scene
   */
  const scene = new THREE.Scene()
  scene.add(cam)
  return scene
}

function makeRenderer(el) {
  /**
   * @summary - Make Renderer - window used
   */
  const renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(el.offsetWidth, el.offsetHeight)
  return renderer
}

function makeControls(camera, renderer) {
  /**
   * @summary - Make Controls
   */
  const controls = new TrackballControls(camera, renderer.domElement)
  controls.rotateSpeed = 2
  controls.zoomSpeed = 2
  controls.panSpeed = 2
  controls.staticMoving = true
  controls.minDistance = 0.3
  controls.maxDistance = 0.3 * 5000
  return controls
}

export function makeTransform(camera, renderer, scene) {
  /**
   * @summary - Make Controls
   */
  const transform = new TransformControls(camera, renderer.domElement)
  transform.setMode('translate')
  transform.setSize(0.2)
  scene.add(transform)
  return transform
}

function animate() {
  /**
   * @summary - Animate function for Point Cloud
   */
  if (!ref.cloud?.el) return
  const cloud = ref.cloud
  const id = requestAnimationFrame(animate)

  cloud.raycaster.setFromCamera(cloud.mouse, cloud.camera)
  if (cloud.points.length > 0) drawHover(cloud)

  cloud.controls.update()
  cloud.renderer.render(cloud.scene, cloud.camera)
  return id
}

function onWindowResize() {
  /**
   * @summary - Animate function for Point Cloud
   */
  const el = ref.cloud.el
  ref.cloud.camera.aspect = el.offsetWidth / el.offsetHeight
  ref.cloud.camera.updateProjectionMatrix()
  ref.cloud.renderer.setSize(el.offsetWidth, el.offsetHeight)
}

function onDocumentMouseMove(event) {
  event.preventDefault()
  ref.cloud.mouse.x = (event.offsetX / ref.cloud.el.offsetWidth) * 2 - 1
  ref.cloud.mouse.y = -(event.offsetY / ref.cloud.el.offsetHeight) * 2 + 1
}

export { initCloud, purgeCloud }
