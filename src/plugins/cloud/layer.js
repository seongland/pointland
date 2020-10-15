import * as THREE from 'three'
import { ref } from './init'

export function makePointLayer({ name, color, size, length, order }) {
  /**
   * @summary - Add Layer
   */
  const geometry = new THREE.BufferGeometry()
  geometry.ids = {}
  var positions = new Float32Array(length * 3)
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setDrawRange(0, 0)
  const material = new THREE.PointsMaterial({ color, size })
  const points = new THREE.Points(geometry, material)
  if (order) points.renderOrder = order
  ref[name] = points
  return points
}
