import express from 'express'
import dotenv from 'dotenv'
import { imagePath, depthmapPath, getNodeMeta, depthData } from './node/image'

dotenv.config()
const router = express.Router()

router.get('/:round/:snap/:seq/:direction', image)
router.get('/:round/:snap/:seq/:direction/depth', depthmap)

function image(req, res) {
  const path = imagePath(req)
  res.sendFile(path)
}

async function depthmap(req, res) {
  const path = depthmapPath(req)
  const imgPath = imagePath(req)
  const meta = await getNodeMeta(req)
  const data = await depthData(path, imgPath, meta)
  res.json(data)
}

export default router
