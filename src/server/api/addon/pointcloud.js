import express from 'express'
import dotenv from 'dotenv'
import { PythonShell } from 'python-shell'
import { existsSync, mkdir, createReadStream } from 'fs'

dotenv.config()
const router = express.Router()

const pythonOptions = {
  mode: 'text',
  pythonPath: process.env.PYTHON_PATH,
  scriptPath: `${process.cwd()}`
}

router.get('/:round/:snap/:seq', pointcloud)
router.get('/:round/:snap/:seq/x', lasx)
router.get('/:round/:snap/:seq/y', lasy)
router.get('/:round/:snap/:seq/z', lasz)
router.get('/:round/:snap/:seq/i', lasi)
router.get('/:round/:snap/:seq/c', lasc)

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
  const snapPath = `${root}\\cache\\${round}\\${snap}\\${seq}`
  mkdir(snapPath, { recursive: true }, () => ({}))
  return snapPath
}


function pointcloud(req, res) {
  const path = lasPath(req)
  const cache = cachePath(req)
  console.log(path, cache)
  if (existsSync(`${cache}\\x.gz`)) return res.json({ cached: true })

  pythonOptions.args = [JSON.stringify(path), JSON.stringify(cache)]

  console.time('json')
  PythonShell.run('src/python/lastojson.py', pythonOptions, (err, result) => {
    console.timeEnd('json')
    if (!err) res.json(JSON.parse(result[0]))
    if (err) res.json({ err, result })
  })

  console.time('gzip')
  PythonShell.run('src/python/lastogzip.py', pythonOptions, (err, result) => {
    console.timeEnd('gzip')
    if (!err) console.log(true)
    if (err) console.log({ err, result })
  })
}

function getRoot(round) {
  return `\\\\10.1.0.113\\2020_aihub\\04_dataset_draw_tool\\${round}`
}


function lasx(req, res) {
  res.writeHead(200, { 'Content-Encoding': 'gzip' })
  const cache = cachePath(req)
  const gz = createReadStream(`${cache}\\x.gz`)
  gz.pipe(res)
}
function lasy(req, res) {
  res.writeHead(200, { 'Content-Encoding': 'gzip' })
  const cache = cachePath(req)
  const gz = createReadStream(`${cache}\\y.gz`)
  gz.pipe(res)
}
function lasz(req, res) {
  res.writeHead(200, { 'Content-Encoding': 'gzip' })
  const cache = cachePath(req)
  const gz = createReadStream(`${cache}\\z.gz`)
  gz.pipe(res)
}
function lasc(req, res) {
  res.writeHead(200, { 'Content-Encoding': 'gzip' })
  const cache = cachePath(req)
  const gz = createReadStream(`${cache}\\c.gz`)
  gz.pipe(res)
}
function lasi(req, res) {
  res.writeHead(200, { 'Content-Encoding': 'gzip' })
  const cache = cachePath(req)
  const gz = createReadStream(`${cache}\\i.gz`)
  gz.pipe(res)
}



export default router
