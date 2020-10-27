import * as THREE from 'three'
import { ref } from './init'

export function resetPointLayer(layer) {
  const geometry = layer.geometry
  geometry.ids = {}
  geometry.indexes = []
  geometry.drawRange.start = 0
  geometry.setDrawRange(0, 0)
  geometry.attributes.position.needsUpdate = true
  geometry.computeBoundingSphere()
}

export function addLas(lasJson, cloud, vertices) {
  /*
   * <summary>index file from js</summary>
   */
  const offset = [
    cloud.offset[0] - lasJson.center[0],
    cloud.offset[1] - lasJson.center[1],
    cloud.offset[2] - lasJson.center[2]
  ]
  for (const i in lasJson.x) vertices.push(lasJson.x[i] - offset[0], lasJson.y[i] - offset[1], lasJson.z[i] - offset[2])
}

export function addPoints(lasJson, colors, vertices, cloud, name) {
  /*
   * <summary>index file from js</summary>
   */
  let intensity
  for (const i in lasJson.intensity) {
    intensity = lasJson.intensity[i] / 255
    colors.push(intensity, intensity, intensity)
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
  const material = new THREE.PointsMaterial({
    size: ref.cloudSize,
    vertexColors: THREE.VertexColors
  })
  const points = new THREE.Points(geometry, material)

  cloud.scene.add(points)

  if (cloud.points) cloud.points.push(points)
  else cloud.points = [points]
  points.name = name
  return points
}

export function firstLas(cloud, lasJson, vertices) {
  /*
   * <summary>index file from js</summary>
   */
  cloud.offset = lasJson.center
  cloud.controls.target.set(0, 0, 0.1)
  for (const i in lasJson.x) vertices.push(lasJson.x[i], lasJson.y[i], lasJson.z[i])
}
