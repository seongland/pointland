/*
 * @summary - Meta Snap, round module
 */

import express from 'express'
import dotenv from 'dotenv'
import { getTable } from './tool/table'

dotenv.config()
const router = express.Router()

router.get('/:round', round)

async function round(req, res) {
  let roundObj
  const round = req.params.round
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
        name: { name: 'id_point', type: String },
        seq: { name: 'sequence', type: Number },
        lat: { name: 'Latitude', type: Number },
        lon: { name: 'Longitude', type: Number },
        alt: { name: 'altitude', type: Number },
        heading: { name: 'heading', type: Number },
        x: { name: 'x_utm', type: Number },
        y: { name: 'y_utm', type: Number },
        roll: { name: 'roll', type: Number },
        pitch: { name: 'pitch', type: Number },
        lasList: { name: 'file_las_se', type: String }
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
  for (const snapObj of roundObj.snaps) {
    try {
      snapObj.marks = await getTable(roundObj.name, snapObj.name, snapObj.image.meta)
    } catch (e) {
      const index = roundObj.snaps.indexOf(snapObj)
      roundObj.snaps.splice(index, 1)
      console.log(e)
    }
  }
  for (const snapObj of roundObj.snaps) {
    try {
      snapObj.areas = await getTable(roundObj.name, snapObj.name, snapObj.pointcloud.meta)
    } catch (e) {
      const index = roundObj.snaps.indexOf(snapObj)
      roundObj.snaps.splice(index, 1)
      console.log(e)
    }
  }
  res.json(roundObj)
}

export default router
