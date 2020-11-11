/*
 * @summary - image api entry point
 */

import express from 'express'
import dotenv from 'dotenv'
import { imagePath, depthmapPath } from './img'
import { depthData2, xyzAtDepthmap2 } from './depthmap'
import { camType } from './config'
import fs from 'fs'

dotenv.config()
const router = express.Router()
const { Converter } = require(process.cwd() + '/build/Debug/tool')

// get
router.get('/:round/:snap/:mark/:direction', image)
// post
router.post('/convert', xyzstoimg)
router.post('/convert/:direction/:x/:y/:z', xyztoimg)
router.post('/depth/:round/:snap/:mark/:direction', depthmap)
router.post('/depth/:round/:snap/:mark/:direction/:x/:y', imgtoxyz)

function image(req, res) {
  const path = imagePath(req)
  if (fs.existsSync(path)) return res.sendFile(path)
  else res.json('')
}

async function depthmap(req, res) {
  const path = depthmapPath(req)
  if (!fs.existsSync(path)) return res.json('')
  const markObj = req.body.data.mark
  const depth = await depthData2(path, markObj)
  res.json(depth)
}

async function imgtoxyz(req, res) {
  const [x, y] = [Number(req.params.x), Number(req.params.y)]
  const path = depthmapPath(req)
  const xyz = await xyzAtDepthmap2(path, x, y)
  res.json([xyz.x, xyz.y, xyz.z])
}

async function xyztoimg(req, res) {
  let coor
  const markObj = req.body.data.mark
  const direction = req.params.direction
  const xyz = [Number(req.params.x), Number(req.params.y), Number(req.params.z)]
  try {
    coor = Converter.convert(camType[direction], markObj, xyz)
  } catch (e) {
    return res.json(e)
  }
  return res.json({
    coor,
    width: camType[direction].iop.width,
    height: camType[direction].iop.height,
    direction: direction
  })
}

async function xyzstoimg(req, res) {
  let coor
  const markObj = req.body.data.mark
  const xyzdis = req.body.data.xyzdis
  const results = []
  for (const xyzdi of xyzdis) {
    const direction = xyzdi.d
    const i = xyzdi.i
    const id = xyzdi.id
    const xyz = [xyzdi.x, xyzdi.y, xyzdi.z]
    coor = Converter.convert(camType[direction], markObj, xyz)
    results.push({
      id,
      coor,
      i,
      width: camType[direction].iop.width,
      height: camType[direction].iop.height,
      direction: direction
    })
  }
  return res.json(results)
}

export default router
