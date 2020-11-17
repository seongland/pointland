import jimp from 'jimp-compact'
import fs from 'fs'
import { LAS_HEADER_SIZE_1_2 } from '../pointcloud/const'
import { to32652, getDistance } from '../tool/coor'

export async function getLasList(root, markObj, snap) {
  /*
   * <summary>index file from js</summary>
   */
  const lasFolder = `${root}/${snap}/pointcloud`
  const lasList = []
  const filePaths = await fs.promises.readdir(lasFolder)
  for (const fileName of filePaths) {
    const file = fs.openSync(`${lasFolder}/${fileName}`, 'r')
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

export async function depthData(depthmapPath, markObj) {
  /*
   * @summary - depthmap image version 1
   */
  const META_SIZE = 12

  const point32652 = to32652(markObj.lon, markObj.lat)
  const fd = fs.openSync(depthmapPath, 'r')
  const meta = Buffer.alloc(META_SIZE)
  fs.readSync(fd, meta, 0, META_SIZE, 0)

  const imageHeight = meta.slice(4, 8).readInt32LE()
  const imageWidth = meta.slice(8, 12).readInt32LE()

  const dimension = 3
  const OFFSET_SIZE = dimension * 8
  const HEAD_SIZE = META_SIZE + OFFSET_SIZE

  const [xOffset, yOffset, zOffset] = getOffsets(fd, 3, META_SIZE)
  const [xBuffer, yBuffer, zBuffer] = getBuffers(imageWidth, imageHeight, fd, dimension, HEAD_SIZE)

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

export async function depthData2(depthmapPath) {
  /*
   * @summary - depthmap image version 1
   */
  const META_SIZE = 16
  const SPACE_DIM = 3
  const OFFSET_SIZE = SPACE_DIM * 8
  const HEAD_SIZE = META_SIZE + OFFSET_SIZE

  const fd = fs.openSync(depthmapPath, 'r')
  const meta = Buffer.alloc(META_SIZE)
  fs.readSync(fd, meta, 0, META_SIZE, 0)

  const imageHeight = meta.slice(4, 8).readInt32LE()
  const imageWidth = meta.slice(8, 12).readInt32LE()
  const dimension = meta.slice(12, 16).readInt32LE()

  const buffers = getBuffers(imageWidth, imageHeight, fd, dimension, HEAD_SIZE)

  let image = new jimp(imageWidth, imageHeight)
  for (let i = 0; i < imageWidth * imageHeight; i++) {
    const intensity = buffers[buffers.length - 2].readFloatLE(i * 4)
    if (intensity === -1) continue
    const color = jimp.rgbaToInt(intensity, intensity, intensity, 255)
    image.setPixelColor(color, parseInt(i / imageHeight), parseInt(i % imageHeight))
  }
  fs.close(fd)
  return {
    uri: await image.getBase64Async('image/png'),
    width: imageWidth,
    height: imageHeight
  }
}

function getOffsets(fd, dimension, position) {
  /*
   * @summary - depthmap image get offset
   */
  const OFFSET_SIZE = 8
  const offsets = []

  const buffer = Buffer.alloc(dimension * OFFSET_SIZE)
  fs.readSync(fd, buffer, 0, dimension * OFFSET_SIZE, position)

  for (const index in new Array(dimension).fill(0)) {
    const offset = buffer.slice(index * OFFSET_SIZE, (index + 1) * OFFSET_SIZE).readDoubleLE()
    offsets.push(offset)
  }
  return offsets
}

function getBuffers(imageWidth, imageHeight, fd, dimension, position) {
  /*
   * @summary - depthmap image get offset
   */
    const SINGLE_SIZE = 4
    const buffers = []
    const xyzGap = imageHeight * imageWidth * 4
  
    for (const index in new Array(dimension).fill(0)) {
      const buffer = Buffer.alloc(imageWidth * imageHeight * SINGLE_SIZE)
      fs.readSync(fd, buffer, 0, imageWidth * imageHeight * SINGLE_SIZE, position + xyzGap * index)
      buffers.push(buffer)
    }
    return buffers
}

export async function xyzAtDepthmap(depthmapPath, x, y) {
  /*
   * @summary - xyz to depthmap
   */
  const META_SIZE = 12
  const fd = fs.openSync(depthmapPath, 'r')
  const meta = Buffer.alloc(12)
  fs.readSync(fd, meta, 0, 12, 0)
  const imageHeight = meta.slice(4, 8).readInt32LE()
  const imageWidth = meta.slice(8, 12).readInt32LE()
  const dimension = 3
  const OFFSET_SIZE = dimension * 8
  const HEAD_SIZE = META_SIZE + OFFSET_SIZE
  const [xOffset, yOffset, zOffset] = getOffsets(fd, 3, META_SIZE)
  const [xBuffer, yBuffer, zBuffer] = getBuffers(imageWidth, imageHeight, fd, dimension, HEAD_SIZE)
  const position = (x * imageHeight + y) * 4
  x = xBuffer.readFloatLE(position) + xOffset
  y = yBuffer.readFloatLE(position) + yOffset
  let z = zBuffer.readFloatLE(position) + zOffset
  fs.close(fd)
  return { x, y, z }
}

export async function xyzAtDepthmap2(depthmapPath, x, y) {
  /*
   * @summary - version 2
   */
  const META_SIZE = 16
  const SPACE_DIM = 3
  const OFFSET_SIZE = SPACE_DIM * 8
  const HEAD_SIZE = META_SIZE + OFFSET_SIZE

  const fd = fs.openSync(depthmapPath, 'r')
  const meta = Buffer.alloc(META_SIZE)
  fs.readSync(fd, meta, 0, META_SIZE, 0)

  const imageHeight = meta.slice(4, 8).readInt32LE()
  const imageWidth = meta.slice(8, 12).readInt32LE()
  const dimension = meta.slice(12, 16).readInt32LE()

  const [xOffset, yOffset, zOffset] = getOffsets(fd, 3, META_SIZE)
  const buffers = getBuffers(imageWidth, imageHeight, fd, dimension, HEAD_SIZE)
  const position = (x * imageHeight + y) * 4

  x = buffers[0].readFloatLE(position) + xOffset
  y = buffers[1].readFloatLE(position) + yOffset
  let z = buffers[2].readFloatLE(position) + zOffset
  fs.close(fd)
  return { x, y, z }
}

export function color(distance) {
  // 1 is white, 0 is black
  let ratio
  if (distance < 5) ratio = 1
  else if (distance < 50) ratio = (55 - distance) / 50
  else ratio = 0.1
  return jimp.rgbaToInt(255 * ratio, 255 * ratio, 255 * ratio, 255)
}
