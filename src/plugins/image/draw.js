import { ref } from './init'

export function drawNear(layer, { direction, x, y, color, id }) {
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
  img.getBase64Async('image/png').then(uri => (layer[direction].uri = uri))
}

export function erase(layer, id) {
  const transparent = 0x00000000
  if (!ref.ids[id]) return
  const { direction, x, y } = ref.ids[id]
  drawNear(layer, { direction, x, y, color: transparent, id })
}
