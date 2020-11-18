/*
 * @summary - Meta Snap, round module
 */

import express from 'express'
import dotenv from 'dotenv'
import { getTable } from './tool/table'
import { PythonShell } from 'python-shell'

const DIV_FACTOR = 100

dotenv.config()
const router = express.Router()
const pythonOptions = {
  mode: 'text',
  pythonPath: process.env.PYTHON_PATH,
  scriptPath: `${process.cwd()}`
}

export default app => {
  app.use('/meta', router)
  router.get('/:round', getRound)
  router.post('/:round/:snap', getSnap)
  router.post('/:round/:snap/upload', uploadSnap)

  async function getRound(req, res) {
    const round = req.params.round
    let roundObj = await app.service('round').Model.findOne({ name: round })
    res.json(roundObj)
  }

  async function getSnap(req, res) {
    const roundName = req.params.round
    const snapName = req.params.snap
    const snapObj = req.body.data.snap

    let markPromise, areaPromise
    try {
      markPromise = getTable(roundName, snapName, snapObj.image.meta)
      areaPromise = getTable(roundName, snapName, snapObj.pointcloud.meta)
    } catch (e) {
      console.log(e)
      return res.json(false)
    }
    const [marks, areas] = await Promise.all([markPromise, areaPromise])
    snapObj.marks = marks
    snapObj.areas = areas

    res.json(snapObj)
  }

  async function uploadSnap(req, res) {
    const roundName = req.params.round
    const snapName = req.params.snap
    const snapObj = req.body.data.snap

    let markPromise, areaPromise
    try {
      markPromise = getTable(roundName, snapName, snapObj.image.meta)
      areaPromise = getTable(roundName, snapName, snapObj.pointcloud.meta)
    } catch (e) {
      console.log(e)
      return res.json(false)
    }
    const [marks, areas] = await Promise.all([markPromise, areaPromise])
    snapObj.marks = marks
    snapObj.areas = areas

    uploadMarks(marks, snapName, roundName)

    res.json(snapObj)
  }

  function uploadMarks(marks, snapName, roundName) {
    const length = marks.length
    const divCount = Math.ceil(length / DIV_FACTOR)
    const tempArray = new Array(divCount).fill(0)
    console.log(`Group Total: ${tempArray.length}`)
    for (const count in tempArray) {
      const tempData = marks.slice(count * DIV_FACTOR, (Number(count) + 1) * DIV_FACTOR)
      console.log(`Group ${count} add started with count ${tempData.length}`)
      pythonOptions.args = [
        JSON.stringify(tempData),
        JSON.stringify(snapName),
        JSON.stringify(roundName),
        JSON.stringify('kaist')
      ]
      PythonShell.run('src/python/markstodb.py', pythonOptions, (err, result) => {
        if (err) console.log(`Upload err in ${count} is `, err)
        else console.log(`Complete ${count} with No Error!`)
      })
    }
  }
}
