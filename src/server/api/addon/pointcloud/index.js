import express from 'express'
import dotenv from 'dotenv'
import { PythonShell } from 'python-shell'
import { existsSync, createReadStream, promises as fs, unlinkSync, rmdirSync } from 'fs'
import { lasPath, cachePath } from './pcd'
import consola from 'consola'

dotenv.config()
const router = express.Router()

const pythonOptions = {
  mode: 'text',
  pythonPath: process.env.PYTHON_PATH,
  scriptPath: `${process.cwd()}`
}

const las = (req, res) => res.sendFile(lasPath(req))

router.get('/:round/:snap/:zone', pointcloud)
router.get('/:round/:snap/:zone/:prop', lasCache)
router.get('/file/:round/:snap/:zone', las)

router.delete('/:round/:snap/:zone', delSvrCache)

function pointcloud(req, res) {
  const path = lasPath(req)
  const cache = cachePath(req)
  if (existsSync(`${cache}/x.gz`)) return res.json({ cached: true })

  pythonOptions.args = [JSON.stringify(path), JSON.stringify(cache)]

  console.time(`json ${req.params.zone}`)
  PythonShell.run('src/python/lastojson.py', pythonOptions, (err, result) => {
    console.timeEnd(`json ${req.params.zone}`)
    if (!err) res.json(JSON.parse(result[0]))
    if (err) res.json({ err, result })
  })

  console.time(`gzip ${req.params.zone}`)
  PythonShell.run('src/python/lastogzip.py', pythonOptions, (err, result) => {
    console.timeEnd(`gzip ${req.params.zone}`)
    if (err) consola.error({ err, result })
    if (!err) return
  })
}

async function delSvrCache(req, res) {
  const cache = cachePath(req)
  const files = await fs.readdir(cache)
  for (const file of files) {
    const path = `${cache}/${file}`
    unlinkSync(path)
  }
  const result = rmdirSync(cache, { recursive: true })
  consola.info('delete', cache, result)
  res.json(result)
}

function lasCache(req, res) {
  const prop = req.params.prop
  const cache = cachePath(req)
  if (!existsSync(`${cache}/${prop}.gz`)) return res.json(false)
  res.writeHead(200, { 'Content-Encoding': 'gzip' })
  const gz = createReadStream(`${cache}/${prop}.gz`)
  gz.pipe(res)
}

export default router
