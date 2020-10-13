/*
 * <summary>img file functions</summary>
 */

import jimp from 'jimp-compact'
import fs from 'fs'
import { LAS_HEADER_SIZE_1_2 } from '../pointcloud/const'
import { getRootByRound } from '../tool/round'
import { to32652 } from '../tool/coor'
import { getDistance, color } from './depthmap'

export async function getLasList(root, markObj, snap) {
  /*
   * <summary>index file from js</summary>
   */
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
    if (minX < markObj.x && markObj.x < maxX && minY < markObj.y && markObj.y < maxY) lasList.push(fileName)
  }
  return lasList
}

export function imagePath(req) {
  /*
   * <summary>index file from js</summary>
   */
  const round = req.params.round
  const snap = req.params.snap
  const mark = req.params.mark
  const direction = req.params.direction

  const root = getRootByRound(round)
  const ext = 'jpg'
  let dir
  if (direction === 'front') dir = '00'
  if (direction === 'back') dir = '01'
  return `${root}\\${snap}\\images\\${dir}_${mark}.${ext}`
}

export function depthmapPath(req) {
  /*
   * <summary>index file from js</summary>
   */

  const round = req.params.round
  const snap = req.params.snap
  const mark = req.params.mark
  const direction = req.params.direction

  const root = getRootByRound(round)
  const ext = 'bin'
  let dir
  if (direction === 'front') dir = '00'
  if (direction === 'back') dir = '01'
  return `${root}\\${snap}\\images_depthmap\\${dir}_${mark}.${ext}`
}

export async function depthData(depthmapPath, markObj) {
  /*
   * <summary>index file from js</summary>
   */

  const point32652 = to32652(markObj.lon, markObj.lat)

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
    const distance = getDistance(...point32652, markObj.alt, xOffset + x, yOffset + y, zOffset + z)
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
  /*
   * <summary>index file from js</summary>
   */

  const offset = Buffer.alloc(24)
  fs.readSync(fd, offset, 0, 24, 12)
  const xOffset = offset.slice(0, 8).readDoubleLE()
  const yOffset = offset.slice(8, 16).readDoubleLE()
  const zOffset = offset.slice(16, 24).readDoubleLE()
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
  /*
   * <summary>index file from js</summary>
   */

  const fd = fs.openSync(depthmapPath, 'r')
  const meta = Buffer.alloc(12)
  fs.readSync(fd, meta, 0, 12, 0)
  const imageHeight = meta.slice(4, 8).readInt32LE()
  const imageWidth = meta.slice(8, 12).readInt32LE()
  const xyzGap = imageHeight * imageWidth * 4

  const { xOffset, yOffset, zOffset } = getOffsets(fd)
  const { xBuffer, yBuffer, zBuffer } = getBuffers(imageWidth, imageHeight, fd, xyzGap)

  const position = (x * imageHeight + y) * 4

  x = xBuffer.readFloatLE(position) + xOffset
  y = yBuffer.readFloatLE(position) + yOffset
  let z = zBuffer.readFloatLE(position) + zOffset
  fs.close(fd)
  return { x, y, z }
}
