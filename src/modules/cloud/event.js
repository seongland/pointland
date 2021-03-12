import * as THREE from 'three'
import { ref } from './init'
import TWEEN from '@tweenjs/tween.js'

export function resetPointLayer(layer) {
  const geometry = layer.geometry
  geometry.ids = {}
  geometry.indexes = []
  geometry.drawRange.start = 0
  geometry.setDrawRange(0, 0)
  geometry.attributes.position.needsUpdate = true
  geometry.computeBoundingSphere()
}

export function removeLineLoops(layer) {
  const cloud = ref.cloud
  const trash = { lines: [], loops: [] }
  for (const line of cloud.lines) if (line.layer === layer) trash.lines.push(line)
  for (const loop of cloud.loops) if (loop.layer === layer) trash.loops.push(loop)
  for (const shapeName of Object.keys(trash))
    for (const shape of trash[shapeName]) {
      cloud.scene.remove(shape)
      const index = cloud[shapeName].indexOf(shape)
      cloud[shapeName].splice(index, 1)
    }
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
  points.name = name
  return points
}
