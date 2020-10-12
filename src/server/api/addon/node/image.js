import jimp from 'jimp-compact'
import fs from 'fs'
import { LAS_HEADER_SIZE_1_2 } from './const'
import { dbfPath, getDbfRecord, getDbfRecords, getRootByRound, to32652, getDistance, color } from './tool'

export async function getNodeMeta(req) {
  const round = req.params.round
  const snap = req.params.snap
  const seq = req.params.seq

  const path = dbfPath(round, snap)
  const record = await getDbfRecord(path, seq)
  return {
    lat: record.Latitude,
    lon: record.Longitude,
    x: record.x_utm,
    y: record.y_utm,
    heading: record.heading,
    alt: record.altitude
  }
}

export async function getImgTable(round, snap) {
  const path = dbfPath(round, snap)
  return await getDbfRecords(path)
}

export async function getLasList(root, meta, snap) {
  const lasFolder = `${root}\\${snap}\\pointcloud`
  const lasList = []
  const filePaths = await fs.promises.readdir(lasFolder)
  for (const fileName of filePaths) {
    const file = fs.openSync(`${lasFolder}\\${fileName}`, 'r')
    const header = Buffer.alloc(LAS_HEADER_SIZE_1_2)
    fs.readSync(file, header, 0, LAS_HEADER_SIZE_1_2, 0)
    const maxX = header.slice(LAS_HEADER_SIZE_1_2 - 6 * 8, LAS_HEADER_SIZE_1_2 - 8 * 5).readDoubleLE()
    const minX = header.slice(LAS_HEADER_SIZE_1_2 - 5 * 8, LAS_HEADER_SIZE_1_2 - 8 * 4).readDoubleLE()
    const maxY = header.slice(LAS_HEADER_SIZE_1_2 - 4 * 8, LAS_HEADER_SIZE_1_2 - 8 * 3).readDoubleLE()
    const minY = header.slice(LAS_HEADER_SIZE_1_2 - 3 * 8, LAS_HEADER_SIZE_1_2 - 8 * 2).readDoubleLE()
    fs.close(file)
    if (minX < meta.x && meta.x < maxX && minY < meta.y && meta.y < maxY) lasList.push(fileName)
  }
  return lasList
}

export function imagePath(req) {
  const round = req.params.round
  const snap = req.params.snap
  const seq = req.params.seq
  const direction = req.params.direction

  const root = getRootByRound(round)
  const ext = 'jpg'
  let dir
  if (direction === 'front') dir = '00'
  if (direction === 'back') dir = '01'
  return `${root}\\${snap}\\images\\${dir}_${seq}.${ext}`
}

export function depthmapPath(req) {
  const round = req.params.round
  const snap = req.params.snap
  const seq = req.params.seq
  const direction = req.params.direction

  const root = getRootByRound(round)
  const ext = 'bin'
  const seq6 = seq.toString().padStart(6, '0')
  let dir
  if (direction === 'front') dir = '00'
  if (direction === 'back') dir = '01'
  return `${root}\\${snap}\\images_depthmap\\${dir}_${seq6}.${ext}`
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
  const { xBuffer, yBuffer, zBuffer } = getBuffers(imageWidth, imageHeight, fd, xyzGap)

  let image = new jimp(imageWidth, imageHeight)
  for (let i = 0; i < imageWidth * imageHeight; i++) {
    const x = xBuffer.readFloatLE(i * 4)
    const y = yBuffer.readFloatLE(i * 4)
    const z = zBuffer.readFloatLE(i * 4)
    if (x === -1) continue
    const distance = getDistance(...point32652, point.alt, xOffset + x, yOffset + y, zOffset + z)
    image.setPixelColor(color(distance), parseInt(i / imageHeight), parseInt(i % imageHeight))
  }
  fs.close(fd)
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
  const { xBuffer, yBuffer, zBuffer } = getBuffers(imageWidth, imageHeight, fd, xyzGap)

  const position = (x * imageHeight + y) * 4

  x = xBuffer.readFloatLE(position) + xOffset
  y = yBuffer.readFloatLE(position) + yOffset
  let z = zBuffer.readFloatLE(position) + zOffset
  console.log(x, y, z)
  fs.close(fd)
  return { x, y, z }
}
