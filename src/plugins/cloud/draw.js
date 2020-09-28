import * as THREE from 'three'
import { ref } from './meta'


const SELECTED_COLOR = [0.4, 1, 0.8]
const HOVER_COLOR = [0.8, 1, 1]

function drawLas(lasJson) {
  ref.loading = true

  const [vertices, colors] = [[], []]
  for (const i in lasJson.x)
    vertices.push(lasJson.x[i], lasJson.y[i], lasJson.z[i])
  let intensity
  for (const i in lasJson.intensity) {
    intensity = lasJson.intensity[i] / 255
    colors.push(
      intensity,
      intensity,
      intensity
    )
  }
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
    size: ref.pointSize,
    vertexColors: THREE.VertexColors
  })
  const points = new THREE.Points(geometry, material)
  ref.cloud.controls.target.set(0, 0, 0.1)
  ref.cloud.scene.add(points)
  ref.cloud.points = points
  console.log(points)
  ref.loading = false
}


function drawHover(cloud) {
  const intersects = cloud.raycaster.intersectObject(cloud.points)
  const hovered = intersects[0]
  const attributes = cloud.points.geometry.attributes
  const colors = attributes.color.array
  const previous = cloud.currentHover

  // If null
  if (!hovered && previous) changeColor(colors, index, previous.intensity, attributes)
  if (!hovered) return

  // check selected
  if (cloud.selected.includes(hovered)) return

  // restore previous
  const index = hovered.index
  if (previous) {
    if (previous.index === index) return
    if (cloud.selected.filter(e => e.index === previous.index).length === 0)
      changeColor(colors, previous.index, previous.intensity, attributes)
    else changeColor(colors, previous.index, SELECTED_COLOR, attributes)
  }

  // save current
  const intensity = colors[3 * index]
  hovered.intensity = intensity
  cloud.currentHover = hovered

  // change color
  changeColor(colors, index, HOVER_COLOR, attributes)
}


function changeColor(colors, index, color, attributes) {
  if (color instanceof Array) {
    colors[3 * index] = color[0]
    colors[3 * index + 1] = color[1]
    colors[3 * index + 2] = color[2]
  }
  else {
    colors[3 * index] = color
    colors[3 * index + 1] = color
    colors[3 * index + 2] = color
  }
  attributes.color.needsUpdate = true
}


function drawClick(cloud) {
  const index = cloud.currentHover.index
  const attributes = cloud.points.geometry.attributes
  const colors = attributes.color.array
  if (cloud.selected.filter(e => e.index === cloud.currentHover.index).length === 0) {
    cloud.selected.push(cloud.currentHover)
    changeColor(colors, index, SELECTED_COLOR, attributes)
    cloud.currentSelected = cloud.currentHover
  }
  else {
    cloud.selected.splice(cloud.selected.indexOf(cloud.currentHover))
    changeColor(colors, index, cloud.currentHover.intensity, attributes)
    cloud.currentSelected = undefined
  }
  console.log(cloud.selected)
}


export { drawLas, drawHover, drawClick }
