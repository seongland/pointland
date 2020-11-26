/*
 * @summary - cloud draw module
 */

import * as THREE from 'three'
import { ref } from './init'
import { firstLas, addLas, addPoints } from './event'
import consola from 'consola'

const HOVER_COLOR = [0.8, 1, 1]

function drawLas(lasJson, name) {
  /*
   * <summary>index file from js</summary>
   */
  const cloud = ref.cloud
  const [vertices, colors] = [[], []]
  ref.loading = true

  if (!cloud.offset) firstLas(cloud, lasJson, vertices)
  else addLas(lasJson, cloud, vertices)
  addPoints(lasJson, colors, vertices, cloud, name)
  ref.loading = false
}

export function drawXYZ(layer, xyz, focus, id) {
  /*
   * <summary>index file from js</summary>
   */
  const cloud = ref.cloud
  const geometry = layer.geometry
  const positions = geometry.attributes.position.array
  const ids = geometry.ids
  const indexes = geometry.indexes
  const xyzInCloud = [xyz[0] - cloud.offset[0], xyz[1] - cloud.offset[1], xyz[2] - cloud.offset[2]]

  // remove
  if (ids[id]) removePoint(layer, id)
  const count = geometry.drawRange.count

  // add
  positions[3 * (geometry.drawRange.start + count)] = xyzInCloud[0]
  positions[3 * (geometry.drawRange.start + count) + 1] = xyzInCloud[1]
  positions[3 * (geometry.drawRange.start + count) + 2] = xyzInCloud[2]
  geometry.setDrawRange(geometry.drawRange.start, ++geometry.drawRange.count)
  geometry.attributes.position.needsUpdate = true
  geometry.computeBoundingSphere()

  if (focus) cloud.controls.target.set(...xyzInCloud)

  // update
  const index = geometry.drawRange.start + geometry.drawRange.count - 1
  indexes[index] = { id }
  ids[id] = { index }
}

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

function drawHover(cloud) {
  /*
   * <summary>index file from js</summary>
   */

  cloud.raycaster.params.Points.threshold = 0.03
  const intersects = cloud.raycaster.intersectObjects(cloud.points)
  const hovered = intersects[0]
  const previous = cloud.currentHover

  // If null
  if (!hovered && previous) {
    changeColor(previous.colors, previous.index, previous.intensity, previous.attributes)
    cloud.currentHover = undefined
  }
  if (!hovered) return

  // restore previous
  const attributes = hovered.object.geometry.attributes
  const colors = attributes.color.array
  const index = hovered.index
  hovered.attributes = attributes
  hovered.colors = colors
  if (previous)
    if (previous.index === index) return
    else changeColor(previous.colors, previous.index, previous.intensity, previous.attributes)

  // save current
  const intensity = colors[3 * index]
  hovered.intensity = intensity
  cloud.currentHover = hovered

  // change color
  changeColor(colors, index, HOVER_COLOR, attributes)
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

function changeColor(colors, index, color, attributes) {
  /*
   * <summary>index file from js</summary>
   */
  if (color instanceof Array) {
    colors[3 * index] = color[0]
    colors[3 * index + 1] = color[1]
    colors[3 * index + 2] = color[2]
  } else {
    colors[3 * index] = color
    colors[3 * index + 1] = color
    colors[3 * index + 2] = color
  }
  attributes.color.needsUpdate = true
}

function click3D(e) {
  /*
   * <summary>index file from js</summary>
   */
  const cloud = ref.cloud
  const targets = []
  if (!e.ctrlKey)
    for (const layerOpt of cloud.opt.pointLayers) {
      if (!ref[layerOpt.name].visible) continue
      ref[layerOpt.name].click = layerOpt.callback.click
      targets.push(ref[layerOpt.name])
    }
  cloud.raycaster.params.Points.threshold = 1
  let intersects = cloud.raycaster.intersectObjects(targets)
  intersects.sort((a, b) => a.distanceToRay - b.distanceToRay)
  let intersect = intersects[0]
  if (intersect) {
    intersect = tuneIntersect(intersect)
    if (!intersect.index) return
    consola.info('Cicked', intersect)
    return intersect.object.click instanceof Function ? intersect.object.click(intersect) : null
  }

  if (!cloud.currentHover) return
  cloud.currentSelected = cloud.currentHover
  const center = cloud.currentSelected.point
  const xyz = [center.x + cloud.offset[0], center.y + cloud.offset[1], center.z + cloud.offset[2]]
  ref.cloud.selectCallback(e, xyz)
}

function tuneIntersect(intersect) {
  const geometry = intersect.object.geometry
  const inputIndex = intersect.index
  const addedIndex = inputIndex + geometry.drawRange.start
  const index = checkIntersectIndex(intersect, [inputIndex, addedIndex])
  intersect.index = index
  return intersect
}

function checkIntersectIndex(intersect, indexs) {
  const geometry = intersect.object.geometry
  const positions = geometry.attributes.position.array
  const target = intersect.point
  let index
  for (const i of indexs)
    if (geometry.indexes[i]) {
      let id = geometry.indexes[i].id
      if (geometry.ids[id].index === i) {
        const mhtD =
          (Math.abs(target.x - positions[3 * i]) +
            Math.abs(target.y - positions[3 * i + 1]) +
            Math.abs(target.z - positions[3 * i + 2])) /
          3
        if (mhtD < intersect.distanceToRay) index = i
      }
    }
  if (!index) consola.error(intersect)
  return index
}

export { drawLas, drawHover, click3D }
