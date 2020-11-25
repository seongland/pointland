import { ref } from './init'

export function drawNear(layer, { direction, x, y, color, id }, update) {
  const img = layer[direction].image
  const list = [
    [x, y],
    [x - 1, y - 1],
    [x + 1, y + 1],
    [x + 1, y - 1],
    [x - 1, y + 1],
    [x, y - 1],
    [x, y + 1],
    [x + 1, y],
    [x - 1, y]
  ]
  if (!ref.ids) ref.ids = {}
  ref.ids[id] = { direction, x, y }
  for (const coor of list) img.setPixelColor(color, ...coor)
  if (update) img.getBase64Async('image/png').then(uri => (layer[direction].uri = uri))
}

export async function updateImg(layer) {
  for (const direction of ['front', 'back']) {
    const img = layer[direction].image
    const uri = await img.getBase64Async('image/png')
    layer[direction].uri = uri
  }
}

export function erase(layer, id) {
  const transparent = 0x00000000
  if (!ref.ids[id]) return
  const direction = ref.ids[id].direction
  const x = ref.ids[id].x
  const y = ref.ids[id].y
  drawNear(layer, { direction, x, y, color: transparent, id }, true)
}
