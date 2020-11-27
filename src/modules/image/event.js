import { ref } from './init'

const NEAR = 5

function getNearest(image, x, y) {
  const nearArray = new Array(NEAR).fill(0).map((_, i) => i + 1)
  for (const d of nearArray) {
    let square = new Array(2 * d + 1).fill(0).map((_, i) => i - d)
    square = square.sort((a, b) => Math.abs(a) - Math.abs(b))
    for (const axios of square) {
      const points = [
        [x + d, y + axios],
        [x - d, y + axios],
        [x + axios, y + d],
        [x + axios, y - d]
      ]
      for (const point of points) if (image.getPixelColor(...point)) return point
    }
  }
}

function checkNearest(direction, x, y) {
  let min = Infinity
  let target = undefined
  for (const id in ref.ids) {
    const existing = ref.ids[id]
    if (existing.direction === direction) {
      const dx = Math.abs(x - existing.x)
      const dy = Math.abs(y - existing.y)
      const d = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2))
      if (d < min) {
        min = d
        target = id
      }
    }
  }
  if (min < 5) return target
}

export async function clickImage(event, depth, drawCallback, selectCallback) {
  const data = getImageData(event, depth)
  const direction = data.direction
  const xRatio = event.offsetX / event.target.offsetWidth
  const yRatio = event.offsetY / event.target.offsetHeight
  const image = data.image
  if (!image) return
  let x = Math.round(image.bitmap.width * xRatio)
  let y = Math.round(image.bitmap.height * yRatio)

  // Check Near Existed
  if (!(event.ctrlKey && event.shiftKey)) {
    let vid = checkNearest(direction, x, y)
    if (vid) return selectCallback(event, vid)
  }

  // Not Existed
  const color = image.getPixelColor(x, y)
  if (color === 0) {
    const point = getNearest(image, x, y)
    if (!point) return
    x = point[0]
    y = point[1]
  }
  drawCallback(event, x, y, data)
}

function getImageData(event, depth) {
  const path = event.path
  for (const element of path)
    if (element.id === 'front') {
      depth.front.direction = element.id
      return depth.front
    } else if (element.id === 'back') {
      depth.back.direction = element.id
      return depth.back
    }
}
