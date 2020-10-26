/*
 * @summary - image api entry point
 */

import express from 'express'
import dotenv from 'dotenv'
import { imagePath, depthmapPath } from './img'
import { depthData, xyzAtDepthmap } from './depthmap'
import { Converter } from '../../../../../build/Debug/tool'
import { camType } from './config'

dotenv.config()
const router = express.Router()

// get
router.get('/:round/:snap/:mark/:direction', image)
router.get('/:round/:snap/:mark/:direction/depth/:x/:y', imgtoxyz)
// post
router.post('/:round/:snap/:mark/:direction/convert/:x/:y/:z', xyztoimg)
router.post('/:round/:snap/:mark/:direction/depth', depthmap)

function image(req, res) {
  const path = imagePath(req)
  res.sendFile(path)
}

async function depthmap(req, res) {
  const path = depthmapPath(req)
  const markObj = req.body.data.mark
  const data = await depthData(path, markObj)
  res.json(data)
}

async function imgtoxyz(req, res) {
  const [x, y] = [Number(req.params.x), Number(req.params.y)]
  const path = depthmapPath(req)
  const xyz = await xyzAtDepthmap(path, x, y)
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
  return res.json(coor)
}

export default router
