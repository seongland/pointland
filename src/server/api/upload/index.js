import { PythonShell } from 'python-shell'
import express from 'express'
import dotenv from 'dotenv'

const DIV_FACTOR = 500

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
    const results = []
    console.log(`Group Total: ${tempArray.length}`)
    for (const count in tempArray) {
      const tempData = body.data.slice(count * DIV_FACTOR, (Number(count) + 1) * DIV_FACTOR)
      console.log(`Group ${count} add started with count ${tempData.length}`)
      pythonOptions.args = [
        JSON.stringify(tempData),
        JSON.stringify(body.add),
        JSON.stringify(body.date),
        JSON.stringify(body.maker),
        JSON.stringify(body.snap),
        JSON.stringify(body.schema)
      ]
      PythonShell.run('upload/pg_uploader.py', pythonOptions, (err, result) => {
        if (err) console.log(`Upload err in ${count} is `, err)
        if (err) res.json({ count, err, results })
        else {
          results.push(result)
          console.log(`Complete ${count} with No Error!`)
          if (Number(count) === tempArray.length - 1) res.json({ results })
        }
      })
    }
  }
}

export default router
