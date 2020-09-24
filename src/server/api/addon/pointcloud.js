import express from 'express'
import dotenv from 'dotenv'
import { PythonShell } from 'python-shell'

dotenv.config()
const router = express.Router()

const pythonOptions = {
  mode: 'text',
  pythonPath: process.env.PYTHON_PATH,
  scriptPath: `${process.cwd()}`
}

router.get('/:round/:snap/:seq', pointcloud)
router.get('/file/:round/:snap/:seq', las)

function las(req, res) {
  res.sendFile(lasPath(req))
}

function lasPath(req) {
  const round = req.params.round
  const snap = req.params.snap
  const seq = req.params.seq
  const root = getRoot(round)
  const ext = "las"
  const seq6 = seq.toString().padStart(6, "0")
  return `${root}\\${snap}\\pointcloud\\STRYX_GEOXYZ_${seq6}.${ext}`
}


function pointcloud(req, res) {
  const path = lasPath(req)

  pythonOptions.args = [JSON.stringify(path)]
  PythonShell.run('src/python/lastojson.py', pythonOptions, (err, result) => {
    if (!err) res.sendFile(result[0])
    if (err) res.json({ err, result })
  })
}

function getRoot(round) {
  return `\\\\10.1.0.113\\2020_aihub\\04_dataset_draw_tool\\${round}`
}

export default router
