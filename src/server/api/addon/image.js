import express from 'express'
import dotenv from 'dotenv'


dotenv.config()
const router = express.Router()


router.get('/:round/:snap/:seq/:direction', image)

function image(req, res) {
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
  const path = `${root}\\${snap}\\images\\${dir}_${seq6}.${ext}`
  res.sendFile(path)
}

function getRoot(round) {
  return `\\\\10.1.0.113\\2020_aihub\\04_dataset_draw_tool\\${round}`
}

export default router
