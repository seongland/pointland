import express from 'express'
import dotenv from 'dotenv'
import proj4 from 'proj4'
import jimp from 'jimp-compact'
import path from 'path'
import fs from 'fs'

const EPSG5186 = '+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=600000 +ellps=GRS80 +units=m +no_defs'
const EPSG32652 = '+proj=utm +zone=52 +ellps=WGS84 +datum=WGS84 +units=m +no_defs'
const WGS84 = '+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs'

dotenv.config()
const router = express.Router()

router.get('/:round/:snap/:seq/:direction', image)
router.get('/:round/:snap/:seq/:direction/depth', depthmap)

function image(req, res) {
  const path = imagePath(req)
  res.sendFile(path)
}

function depthmap(req, res) {
  const path = depthmapPath(req)
  const imgPath = imagePath(req)
  const meta = getMeta(req)
  drawAtPanoImage(path, imgPath, meta)
  res.sendFile(path)
}

function getMeta(req) {
  return {
    lat: 37.578493,
    lon: 126.890831,
    alt: 38.598289,
    height: 2
  }
}

function imagePath(req) {
  const round = req.params.round
  const snap = req.params.snap
  const seq = req.params.seq
  const direction = req.params.direction

  const root = getRoot(round)
  const ext = "jpg"
  const seq6 = seq.toString().padStart(6, "0")
  let dir
  if (direction === "front") dir = "00"
  if (direction === "back") dir = "01"
  return `${root}\\${snap}\\images\\${dir}_${seq6}.${ext}`
}


function depthmapPath(req) {
  const round = req.params.round
  const snap = req.params.snap
  const seq = req.params.seq
  const direction = req.params.direction

  const root = getRoot(round)
  const ext = "bin"
  const seq6 = seq.toString().padStart(6, "0")
  let dir
  if (direction === "front") dir = "00"
  if (direction === "back") dir = "01"
  return `${root}\\${snap}\\depthmap\\${dir}_${seq6}.${ext}`
}


function getRoot(round) {
  return `\\\\10.1.0.113\\2020_aihub\\04_dataset_draw_tool\\${round}`
}


async function drawAtPanoImage(depthmapPath, imagePath, point) {
  try {
    const fd = fs.openSync(depthmapPath, 'r')
    const meta = Buffer.alloc(12)
    fs.readSync(fd, meta, 0, 12, 0)

    // eslint-disable-next-line no-unused-vars
    const resizeRatio = meta.slice(0, 4).readFloatLE()
    const imageHeight = meta.slice(4, 8).readInt32LE()
    const imageWidth = meta.slice(8, 12).readInt32LE()
    console.log(
      `resizeRatio: ${resizeRatio}, imageHeight: ${imageHeight}, imageWidth: ${imageWidth}`
    )

    const offset = Buffer.alloc(24)
    fs.readSync(fd, offset, 0, 24, 12)
    const xOffset = offset.slice(0, 8).readDoubleLE()
    const yOffset = offset.slice(8, 16).readDoubleLE()
    const zOffset = offset.slice(16, 24).readDoubleLE()
    console.log(`xOffset: ${xOffset}, yOffset: ${yOffset}, zOffset: ${zOffset}`)

    const xyzGap = imageHeight * imageWidth * 4

    // Set read buffer
    const xBuffer = Buffer.alloc(4 * imageWidth * imageHeight)
    const yBuffer = Buffer.alloc(4 * imageWidth * imageHeight)
    const zBuffer = Buffer.alloc(4 * imageWidth * imageHeight)
    fs.readSync(fd, xBuffer, 0, imageWidth * imageHeight * 4, 36)
    fs.readSync(fd, yBuffer, 0, imageWidth * imageHeight * 4, 36 + xyzGap)
    fs.readSync(fd, zBuffer, 0, imageWidth * imageHeight * 4, 36 + xyzGap * 2)

    const image = await jimp.read(imagePath)
    image.resize(imageWidth, imageHeight)
    const point32652 = to32652(point.lon, point.lat)
    console.log(point32652)

    for (let i = 0; i < imageWidth * imageHeight; i++) {
      const x = xBuffer.readFloatLE(i * 4)
      const y = yBuffer.readFloatLE(i * 4)
      const z = zBuffer.readFloatLE(i * 4)

      if (!(x === -1)) {
        const distance = getDistance(
          point32652[0],
          point32652[1],
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
    }
    const parsedPath = path.parse(imagePath)
    const destinationPath = path.join(
      parsedPath.dir,
      parsedPath.name + '_depth' + parsedPath.ext
    )
    console.log(`Start making depthmap images - ${destinationPath}`)
    image.write(destinationPath)
    console.log(`End making depthmap images - ${destinationPath}`)
  } catch (e) {
    console.log(e)
  }
}

function getDistance(x1, y1, z1, x2, y2, z2) {
  return Math.sqrt(
    Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2) + Math.pow(z1 - z2, 2)
  )
}

function to32652(lon, lat) {
  console.log(lon, lat)
  return proj4(WGS84, EPSG32652, [parseFloat(lon), parseFloat(lat)])
}

function color(distance) {
  let ratio
  if (distance < 50) ratio = (50 - distance) / 50
  else ratio = 1
  return jimp.rgbaToInt(255 * ratio, 255 * ratio, 255 * ratio, 255)
}

export default router
