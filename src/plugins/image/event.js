import { ref } from './init'

const NEAR = 5

function checkNear(image, x, y) {
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

export async function imageClick(event, depth, drawCallback) {
  const xRatio = event.offsetX / event.target.offsetWidth
  const yRatio = event.offsetY / event.target.offsetHeight
  const data = getImageData(event, depth)
  const image = data.image
  if (!image) return
  let x = Math.round(image.bitmap.width * xRatio)
  let y = Math.round(image.bitmap.height * yRatio)
  const color = image.getPixelColor(x, y)
  if (color === 0) {
    const point = checkNear(image, x, y)
    if (!point) return
    x = point[0]
    y = point[1]
  }
  drawCallback(x, y, data)
}

function getImageData(event, depth) {
  const path = event.path
  for (const element of path)
    if (element.id === 'front') return depth.front
    else if (element.id === 'back') return depth.back
}
