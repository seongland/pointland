import jimp from 'jimp-compact'

export function color(distance) {
  // 1 is white, 0 is black
  let ratio
  if (distance < 5) ratio = 1
  else if (distance < 50) ratio = (55 - distance) / 50
  else ratio = 0.1
  return jimp.rgbaToInt(255 * ratio, 255 * ratio, 255 * ratio, 255)
}

export function getDistance(x1, y1, z1, x2, y2, z2) {
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2) + Math.pow(z1 - z2, 2))
}
