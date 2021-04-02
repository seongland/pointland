/*
 * @summary - cloud draw module
 */

import * as THREE from 'three'
import { ref } from './init'
import consola from 'consola'

export function removePoint(layer, id) {
  const geometry = layer.geometry
  const ids = geometry.ids
  const indexes = geometry.indexes
  const positions = geometry.attributes.position.array
  const start = geometry.drawRange.start

  const index = ids[id]?.index
  if (!index) return
  const substitute = indexes[start].id

  // update geometry
  positions[3 * index] = positions[3 * start]
  positions[3 * index + 1] = positions[3 * start + 1]
  positions[3 * index + 2] = positions[3 * start + 2]
  geometry.drawRange.count--
  geometry.attributes.position.needsUpdate = true
  geometry.computeBoundingSphere()

  // update info
  ids[id] = undefined
  ids[substitute] = { index: index }

  indexes[index] = { id: substitute }
  indexes[start] = undefined

  geometry.drawRange.start = start + 1
}

export function drawLoop(xyzs, layer) {
  /*
   * <summary>draw polygon</summary>
   */
  const cloud = ref.cloud
  for (const coordinates of xyzs) {
    // Geometry
    const geometry = new THREE.BufferGeometry()
    const positions = []
    for (const xyz of coordinates)
      positions.push(xyz[0] - cloud.offset[0], xyz[1] - cloud.offset[1], xyz[2] - cloud.offset[2])
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    geometry.computeBoundingSphere()

    // Material
    let color, width, order
    for (const layerOpt of cloud.opt.pointLayers)
      if (layerOpt.name === layer) {
        color = layerOpt.line.color
        width = layerOpt.line.width
        order = layerOpt.order
      }
    const material = new THREE.LineBasicMaterial({ color, linewidth: width })

    // Insert
    const loop = new THREE.LineLoop(geometry, material)
    loop.renderOrder = order
    loop.layer = layer
    cloud.scene.add(loop)
    cloud.loops.push(loop)
  }
}

export function drawLine(xyzs, layer) {
  /*
   * <summary>draw LineString</summary>
   */
  const cloud = ref.cloud

  // Geometry
  const geometry = new THREE.BufferGeometry()
  const positions = []
  for (const xyz of xyzs) positions.push(xyz[0] - cloud.offset[0], xyz[1] - cloud.offset[1], xyz[2] - cloud.offset[2])
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geometry.computeBoundingSphere()

  // Material
  let color, width, order
  for (const layerOpt of cloud.opt.pointLayers)
    if (layerOpt.name === layer) {
      color = layerOpt.line.color
      width = layerOpt.line.width
      order = layerOpt.order
    }
  const material = new THREE.LineBasicMaterial({ color, linewidth: width })

  // Insert
  const line = new THREE.Line(geometry, material)
  line.renderOrder = order
  line.layer = layer
  cloud.scene.add(line)
  cloud.lines.push(line)
}

function click3D(e) {
  /*
   * @summary - double click cloud callback
   */
  const cloud = ref.cloud
  const targets = []

  // Always Make New
  if (!(e.ctrlKey && e.shiftKey))
    for (const layerOpt of cloud.opt.pointLayers) {
      if (!(layerOpt.callback.click instanceof Function)) continue
      if (!ref[layerOpt.name].visible) continue
      ref[layerOpt.name].click = layerOpt.callback.click
      targets.push(ref[layerOpt.name])
    }

  // Select Near
  cloud.raycaster.params.Points.threshold = 1
  let intersects = cloud.raycaster.intersectObjects(targets)
  intersects.sort((a, b) => a.distanceToRay - b.distanceToRay)
  let intersect = intersects[0]
  if (intersect) {
    if (process.env.target === 'cloud') consola.info('3D Point', intersect)
    if (intersect.index === undefined) return
    return intersect.object.click(e, intersect)
  }

  // Make New
  if (cloud.pointclouds.length < 1) return
  cloud.raycaster.params.Points.threshold = 0.1
  cloud.currentHover = cloud.raycaster.intersectObjects(cloud.pointclouds, true)[0]

  if (!cloud.currentHover) return
  const clicked = cloud.currentHover
  const center = clicked.point
  const xyz = [center.x, center.y, center.z]
  ref.cloud.makeCallback(e, xyz)
}

export { click3D }
