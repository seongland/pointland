/*
 * <summary>image api entry point</summary>
 */

import express from 'express'
import dotenv from 'dotenv'
import { imagePath, depthmapPath } from './image/img'
import { depthData, xyzAtDepthmap } from './image/depthmap'

dotenv.config()
const router = express.Router()

// get
router.get('/:round/:snap/:mark/:direction', image)
router.get('/:round/:snap/:mark/:direction/depth/:x/:y', imgtoxyz)
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

export default router
