/*
 * <summary>image api entry point</summary>
 */

import express from 'express'
import dotenv from 'dotenv'
import { xyto84 } from './tool/coor'
import { imagePath, depthmapPath, depthData, xyzAtDepthmap, getLasList } from './image/img'
import { getRootByRound } from './tool/round'

dotenv.config()
const router = express.Router()

// get
router.get('/:round/:snap/:mark/:direction', image)
router.get('/:round/:snap/:mark/:direction/depth/:x/:y', imgtoxyz)
// post
router.post('/:round/:snap/:mark/las', lasList)
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

async function lasList(req, res) {
  const round = req.params.round
  const snap = req.params.snap
  const root = getRootByRound(round)
  const markObj = req.body.data.mark
  const lasList = await getLasList(root, markObj, snap)
  res.json(lasList)
}

async function imgtoxyz(req, res) {
  const [x, y] = [Number(req.params.x), Number(req.params.y)]
  const path = depthmapPath(req)
  const xyz = await xyzAtDepthmap(path, x, y)
  const lnglat = xyto84(xyz.x, xyz.y)
  res.json([lnglat[1], lnglat[0], xyz.z])
}

export default router
