/*
 * @summary - Meta Snap, round module
 */

import express from 'express'
import dotenv from 'dotenv'
import { getTable } from './tool/table'
import { PythonShell } from 'python-shell'
import { approximatelyEquals } from 'ol/extent'

const DIV_FACTOR = 100

dotenv.config()
const router = express.Router()
const pythonOptions = {
  mode: 'text',
  pythonPath: process.env.PYTHON_PATH,
  scriptPath: `${process.cwd()}`
}

const image = {
  formats: [
    { type: 'img', folder: 'images', ext: 'jpg' },
    { type: 'depthmap', folder: 'images_depthmap', ext: 'bin' }
  ],
  meta: {
    folder: 'auxiliary',
    ext: 'csv',
    filter: 'lasList',
    column: {
      name: { name: 'id_point', num: false },
      seq: { name: 'sequence', num: true },
      lat: { name: 'Latitude', num: true },
      lon: { name: 'Longitude', num: true },
      alt: { name: 'altitude', num: true },
      heading: { name: 'heading', num: true },
      x: { name: 'x_utm', num: true },
      y: { name: 'y_utm', num: true },
      roll: { name: 'roll', num: true },
      pitch: { name: 'pitch', num: true },
      mainArea: { name: 'file_las_close', num: false },
      lasList: { name: 'file_las_se', num: false }
    },
    prefix: {
      front: '00',
      back: '01'
    },
    sep: '_'
  }
}
const pointcloud = {
  formats: [
    { type: 'pcd', folder: 'pointcloud', ext: 'las' },
    { type: 'depthmap', folder: 'images_depthmap_point', ext: 'bin' }
  ],
  meta: {
    folder: 'pointcloud_shp',
    ext: 'dbf',
    column: {
      name: { name: 'file_las', type: String }
    }
  }
}

router.get('/:round', getRound)
router.post('/:round/:snap', getSnap)

async function getRound(req, res) {
  const round = req.params.round
  let roundObj
  if (round === 'imms_20200910_000230')
    roundObj = {
      name: 'imms_20200910_000230',
      nas: { id: '10.2.0.108' },
      root: 'mms_test2/2020_imms/00_proj_hdmap/01_cto_output/Daejeon_KAIST/imms_20200910_000230',
      snaps: [
        { name: 'snap1', folder: 'snap1', image, pointcloud },
        { name: 'snap2', folder: 'snap2', image, pointcloud },
        { name: 'snap3', folder: 'snap3', image, pointcloud },
        { name: 'snap4', folder: 'snap4', image, pointcloud },
        { name: 'snap5', folder: 'snap5', image, pointcloud },
        { name: 'snap6', folder: 'snap6', image, pointcloud },
        { name: 'snap7', folder: 'snap7', image, pointcloud },
        { name: 'snap8', folder: 'snap8', image, pointcloud },
        { name: 'snap9', folder: 'snap9', image, pointcloud },
        { name: 'snap10', folder: 'snap10', image, pointcloud },
        { name: 'snap11', folder: 'snap11', image, pointcloud },
        { name: 'snap101', folder: 'snap101', image, pointcloud },
        { name: 'snap102', folder: 'snap102', image, pointcloud },
        { name: 'snap103', folder: 'snap103', image, pointcloud }
      ]
    }
  else if (round === 'imms_20200909_231253')
    roundObj = {
      name: 'imms_20200909_231253',
      nas: { id: '10.2.0.108' },
      root: 'mms_test2/2020_imms/00_proj_hdmap/01_cto_output/Daejeon_KAIST/imms_20200909_231253',
      snaps: [
        { name: 'snap1', folder: 'snap1', image, pointcloud },
        { name: 'snap2', folder: 'snap2', image, pointcloud },
        { name: 'snap3', folder: 'snap3', image, pointcloud },
        { name: 'snap4', folder: 'snap4', image, pointcloud },
        { name: 'snap5', folder: 'snap5', image, pointcloud },
        { name: 'snap6', folder: 'snap6', image, pointcloud },
        { name: 'snap104', folder: 'snap104', image, pointcloud },
        { name: 'snap105', folder: 'snap105', image, pointcloud }
      ]
    }
  else if (round === 'imms_20201026_145535')
    roundObj = {
      name: 'imms_20201026_145535',
      nas: { id: '10.2.0.108' },
      root: 'mms_test2/2020_imms/00_proj_hdmap/01_cto_output/Daejeon_KAIST/imms_20201026_145535',
      snaps: [
        { name: 'snap106', folder: 'snap106', image, pointcloud },
        { name: 'snap107', folder: 'snap107', image, pointcloud },
        { name: 'snap108', folder: 'snap108', image, pointcloud },
        { name: 'snap109', folder: 'snap109', image, pointcloud },
        { name: 'snap110', folder: 'snap110', image, pointcloud },
        { name: 'snap111', folder: 'snap111', image, pointcloud }
      ]
    }
  else if (round === 'imms_20201026_153812')
    roundObj = {
      name: 'imms_20201026_153812',
      nas: { id: '10.2.0.108' },
      root: 'mms_test2/2020_imms/00_proj_hdmap/01_cto_output/Daejeon_KAIST/imms_20201026_153812',
      snaps: [
        { name: 'snap113', folder: 'snap113', image, pointcloud },
        { name: 'snap114', folder: 'snap114', image, pointcloud },
        { name: 'snap115', folder: 'snap115', image, pointcloud },
        { name: 'snap116', folder: 'snap116', image, pointcloud }
      ]
    }
    else if (round === 'imms_20201106_172834')
    roundObj = {
      name: 'imms_20201106_172834',
      nas: { id: '10.2.0.108' },
      root: 'mms_test2/2020_imms/00_proj_hdmap/01_cto_output/Daejeon_KAIST/imms_20201106_172834',
      snaps: [
        { name: 'snap1', folder: 'snap1', image, pointcloud },
        { name: 'snap2', folder: 'snap2', image, pointcloud },
        { name: 'snap3', folder: 'snap3', image, pointcloud },
        { name: 'snap5', folder: 'snap5', image, pointcloud },
        { name: 'snap6', folder: 'snap6', image, pointcloud },
        { name: 'snap7', folder: 'snap7', image, pointcloud },
        { name: 'snap8', folder: 'snap8', image, pointcloud },
        { name: 'snap10', folder: 'snap10', image, pointcloud },
        { name: 'snap11', folder: 'snap11', image, pointcloud },
        { name: 'snap12', folder: 'snap12', image, pointcloud },
        { name: 'snap13', folder: 'snap13', image, pointcloud },
        { name: 'snap14', folder: 'snap14', image, pointcloud },
        { name: 'snap15', folder: 'snap15', image, pointcloud },
        { name: 'snap16', folder: 'snap16', image, pointcloud },
        { name: 'snap17', folder: 'snap17', image, pointcloud },
        { name: 'snap18', folder: 'snap18', image, pointcloud },
        { name: 'snap19', folder: 'snap19', image, pointcloud }
      ]
    }
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
  snapObj.areas = approximatelyEquals

  // uploadMarks(marks, snapName, roundName)

  res.json(snapObj)
}

export default router

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
