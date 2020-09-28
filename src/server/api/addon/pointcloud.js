import express from 'express'
import dotenv from 'dotenv'
import { PythonShell } from 'python-shell'
import { existsSync, mkdir } from 'fs'

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


function cachePath(req) {
  const round = req.params.round
  const snap = req.params.snap
  const seq = req.params.seq
  const root = process.cwd()
  const snapPath = `${root}\\cache\\${round}\\${snap}`
  mkdir(snapPath, { recursive: true }, () => ({}))
  return `${snapPath}\\${seq}.json`
}


function pointcloud(req, res) {
  const path = lasPath(req)
  const cache = cachePath(req)
  console.log(path, cache)
  if (existsSync(cache)) return res.sendFile(cache)

  pythonOptions.args = [JSON.stringify(path), JSON.stringify(cache)]

  console.time('python')
  PythonShell.run('src/python/lastojson.py', pythonOptions, (err, result) => {
    console.timeEnd('python')
    if (!err) res.sendFile(result[0])
    if (err) res.json({ err, result })
  })
}

function getRoot(round) {
  return `\\\\10.1.0.113\\2020_aihub\\04_dataset_draw_tool\\${round}`
}

export default router
