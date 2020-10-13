import express from 'express'
import dotenv from 'dotenv'
import { PythonShell } from 'python-shell'
import { existsSync, createReadStream } from 'fs'
import { lasPath, cachePath } from './pointcloud/pcd'

dotenv.config()
const router = express.Router()

const pythonOptions = {
  mode: 'text',
  pythonPath: process.env.PYTHON_PATH,
  scriptPath: `${process.cwd()}`
}

router.get('/:round/:snap/:mark', pointcloud)
router.get('/:round/:snap/:mark/:prop', lasCache)
router.get('/file/:round/:snap/:mark', las)

function las(req, res) {
  res.sendFile(lasPath(req))
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

function lasCache(req, res) {
  const prop = req.params.prop
  res.writeHead(200, { 'Content-Encoding': 'gzip' })
  const cache = cachePath(req)
  const gz = createReadStream(`${cache}\\${prop}.gz`)
  gz.pipe(res)
}

export default router
