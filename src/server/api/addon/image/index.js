/*
 * <summary>image api entry point</summary>
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
router.get('/:round/:snap/:mark/:direction/depth/:x/:y/:z', xyztoimg)
// post
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
  const markObj = req.body.data.mark
  const xyz = [Number(req.params.x), Number(req.params.y), Number(req.params.z)]
  console.log(Converter.convert(camType.front, markObj, xyz))
  res.json({})
}

export default router
