import express from 'express'
import dotenv from 'dotenv'
import { PythonShell } from 'python-shell'
import { existsSync, createReadStream } from 'fs'
import { lasPath, cachePath } from './pcd'

dotenv.config()
const router = express.Router()

const pythonOptions = {
  mode: 'text',
  pythonPath: process.env.PYTHON_PATH,
  scriptPath: `${process.cwd()}`
}

const las = (req, res) => res.sendFile(lasPath(req))

router.get('/:round/:snap/:area', pointcloud)
router.get('/:round/:snap/:area/:prop', lasCache)
router.get('/file/:round/:snap/:area', las)

function pointcloud(req, res) {
  const path = lasPath(req)
  const cache = cachePath(req)
  if (existsSync(`${cache}/x.gz`)) return res.json({ cached: true })

  pythonOptions.args = [JSON.stringify(path), JSON.stringify(cache)]

  console.time(`json ${req.params.area}`)
  PythonShell.run('src/python/lastojson.py', pythonOptions, (err, result) => {
    console.timeEnd(`json ${req.params.area}`)
    if (!err) res.json(JSON.parse(result[0]))
    if (err) res.json({ err, result })
  })

  console.time(`gzip ${req.params.area}`)
  PythonShell.run('src/python/lastogzip.py', pythonOptions, (err, result) => {
    console.timeEnd(`gzip ${req.params.area}`)
    if (err) console.log({ err, result })
    if (!err) return
  })
}

function lasCache(req, res) {
  const prop = req.params.prop
  res.writeHead(200, { 'Content-Encoding': 'gzip' })
  const cache = cachePath(req)
  const gz = createReadStream(`${cache}/${prop}.gz`)
  gz.pipe(res)
}

export default router
