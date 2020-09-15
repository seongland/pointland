import { PythonShell } from 'python-shell'
import express from 'express'
import dotenv from 'dotenv'

const DIV_FACTOR = 1000

dotenv.config()
const router = express.Router()

const pythonOptions = {
  mode: 'text',
  pythonPath: process.env.PYTHON_PATH,
  scriptPath: `${process.cwd()}`
}

router.post('/', upload)

function upload(req, res) {
  const body = req.body
  if (body.data) {
    const length = body.data.length
    console.log("Count is ", length)
    console.log("date, maker, snap, schema", body.date, body.maker, body.snap, body.schema)
    const divCount = Math.ceil(length / DIV_FACTOR)
    const tempArray = new Array(divCount).fill(0)
    for (const count in tempArray) {
      pythonOptions.args = [
        JSON.stringify(body.data.slice(count * 1000, (count + 1) * 1000)),
        JSON.stringify(body.add),
        JSON.stringify(body.date),
        JSON.stringify(body.maker),
        JSON.stringify(body.snap),
        JSON.stringify(body.schema)
      ]
      PythonShell.run('upload/pg_uploader.py', pythonOptions, (err, results) => {
        if (err) console.log(`Upload err in ${count} is `, err)
        if (err) res.json({ count, err, results })
        else {
          console.log("Complete with No Error!")
          res.json({ results })
        }
      })
    }
  }



}

export default router
