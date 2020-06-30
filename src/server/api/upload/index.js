import { PythonShell } from 'python-shell'
import express from 'express'
import dotenv from 'dotenv'

dotenv.config()
const router = express.Router()

const pythonOptions = {
  mode: 'text',
  pythonPath: process.env.PYTHON_PATH,
  scriptPath: `${process.cwd()}`
}

router.post('/', upload)

function upload(req, res) {
  pythonOptions.args = JSON.stringify(req.body.data)
  PythonShell.run('upload/pg_uploader.py', pythonOptions, (err, results) => {
    if (err) res.json({ err })
    else res.json({ results })
  })
}

export default router
