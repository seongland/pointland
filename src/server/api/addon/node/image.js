import jimp from 'jimp-compact'
import fs from 'fs'
import {
  dbfPath,
  getDbfRecord,
  getRoot,
  to32652,
  getDistance,
  color
} from './tool'

export async function getNodeMeta(req) {
  const path = dbfPath(req)
  const seq = req.params.seq
  const record = await getDbfRecord(path, seq)
  return {
    lat: record.Latitude,
    lon: record.Longitude,
    alt: record.altitude
  }
}

export function imagePath(req) {
  const round = req.params.round
  const snap = req.params.snap
  const seq = req.params.seq
  const direction = req.params.direction

  const root = getRoot(round)
  const ext = 'jpg'
  const seq6 = seq.toString().padStart(6, '0')
  let dir
  if (direction === 'front') dir = '00'
  if (direction === 'back') dir = '01'
  return `${root}\\${snap}\\images\\${dir}_${seq6}.${ext}`
}

export function depthmapPath(req) {
  const round = req.params.round
  const snap = req.params.snap
  const seq = req.params.seq
  const direction = req.params.direction

  const root = getRoot(round)
  const ext = 'bin'
  const seq6 = seq.toString().padStart(6, '0')
  let dir
  if (direction === 'front') dir = '00'
  if (direction === 'back') dir = '01'
  return `${root}\\${snap}\\depthmap\\${dir}_${seq6}.${ext}`
}

export async function depthData(depthmapPath, point) {
  const point32652 = to32652(point.lon, point.lat)

  const fd = fs.openSync(depthmapPath, 'r')
  const meta = Buffer.alloc(12)
  fs.readSync(fd, meta, 0, 12, 0)
  const imageHeight = meta.slice(4, 8).readInt32LE()
  const imageWidth = meta.slice(8, 12).readInt32LE()
  const xyzGap = imageHeight * imageWidth * 4

  const { xOffset, yOffset, zOffset } = getOffsets(fd)
  const { xBuffer, yBuffer, zBuffer } = getBuffers(
    imageWidth,
    imageHeight,
    fd,
    xyzGap
  )

  let image = new jimp(imageWidth, imageHeight)
  for (let i = 0; i < imageWidth * imageHeight; i++) {
    const x = xBuffer.readFloatLE(i * 4)
    const y = yBuffer.readFloatLE(i * 4)
    const z = zBuffer.readFloatLE(i * 4)
    if (x === -1) continue
    const distance = getDistance(
      ...point32652,
      point.alt,
      xOffset + x,
      yOffset + y,
      zOffset + z
    )
    image.setPixelColor(
      color(distance),
      parseInt(i / imageHeight),
      parseInt(i % imageHeight)
    )
  }
  return {
    uri: await image.getBase64Async('image/png'),
    width: imageWidth,
    height: imageHeight
  }
}

function getOffsets(fd) {
  const offset = Buffer.alloc(24)
  fs.readSync(fd, offset, 0, 24, 12)
  const xOffset = offset.slice(0, 8).readDoubleLE()
  const yOffset = offset.slice(8, 16).readDoubleLE()
  const zOffset = offset.slice(16, 24).readDoubleLE()
  console.log(`xOffset: ${xOffset}, yOffset: ${yOffset}, zOffset: ${zOffset}`)
  return { xOffset, yOffset, zOffset }
}

function getBuffers(imageWidth, imageHeight, fd, xyzGap) {
  const xBuffer = Buffer.alloc(4 * imageWidth * imageHeight)
  const yBuffer = Buffer.alloc(4 * imageWidth * imageHeight)
  const zBuffer = Buffer.alloc(4 * imageWidth * imageHeight)
  fs.readSync(fd, xBuffer, 0, imageWidth * imageHeight * 4, 36)
  fs.readSync(fd, yBuffer, 0, imageWidth * imageHeight * 4, 36 + xyzGap)
  fs.readSync(fd, zBuffer, 0, imageWidth * imageHeight * 4, 36 + xyzGap * 2)
  return { xBuffer, yBuffer, zBuffer }
}

export async function xyzAtDepthmap(depthmapPath, x, y) {
  const fd = fs.openSync(depthmapPath, 'r')
  const meta = Buffer.alloc(12)
  fs.readSync(fd, meta, 0, 12, 0)
  const imageHeight = meta.slice(4, 8).readInt32LE()
  const imageWidth = meta.slice(8, 12).readInt32LE()
  const xyzGap = imageHeight * imageWidth * 4
  console.log(x, y, imageHeight, imageWidth)

  const { xOffset, yOffset, zOffset } = getOffsets(fd)
  const { xBuffer, yBuffer, zBuffer } = getBuffers(
    imageWidth,
    imageHeight,
    fd,
    xyzGap
  )

  const position = (x * imageHeight + y) * 4

  x = xBuffer.readFloatLE(position) + xOffset
  y = yBuffer.readFloatLE(position) + yOffset
  let z = zBuffer.readFloatLE(position) + zOffset
  console.log(x, y, z)
  return { x, y, z }
}
