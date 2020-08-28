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
  if (req.body.data) console.log("Count is ", req.body.data.length)
  const body = req.body
  console.log("date, maker, snap, schema", body.date, body.maker, body.snap, body.schema)
  pythonOptions.args = [
    JSON.stringify(req.body.data),
    JSON.stringify(req.body.add),
    JSON.stringify(req.body.date),
    JSON.stringify(req.body.maker),
    JSON.stringify(req.body.snap),
    JSON.stringify(req.body.schema)
  ]
  PythonShell.run('upload/pg_uploader.py', pythonOptions, (err, results) => {
    if (err) console.log("Upload err is ", err)
    if (err) res.json({ err, results })
    else {
      console.log("Complete with No Error!")
      res.json({ results })
    }
  })
}

export default router
