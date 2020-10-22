import * as THREE from 'three'
import { ref } from './init'

export function makePointLayer({ name, color, size, length, order }) {
  /**
   * @summary - Add Layer
   */
  const geometry = new THREE.BufferGeometry()
  geometry.ids = {}
  geometry.indexes = []
  geometry.drawRange.start = 0
  geometry.drawRange.count = 0
  var positions = new Float32Array(length * 3)
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setDrawRange(geometry.drawRange.start, geometry.drawRange.count)
  const material = new THREE.PointsMaterial({ color, size })
  const points = new THREE.Points(geometry, material)
  if (order) points.renderOrder = order
  ref[name] = points
  return points
}
