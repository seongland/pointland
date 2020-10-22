import express from 'express'
import dotenv from 'dotenv'
import { getTable } from './tool/table'

dotenv.config()
const router = express.Router()

router.get('/:round', round)

async function round(req, res) {
  let roundObj
  const round = req.params.round

  if (round === 'imms_20200910_000230')
    roundObj = {
      name: 'imms_20200910_000230',
      nas: { id: '10.2.0.108' },
      root: 'mms_test2/2020_imms/00_proj_hdmap/01_cto_output/Daejeon_KAIST/imms_20200910_000230',
      snaps: [
        {
          name: 'snap1',
          folder: 'snap1',
          image: {
            formats: [
              { type: 'img', folder: 'images', ext: 'jpg' },
              { type: 'depthmap', folder: 'images_depthmap', ext: 'bin' }
            ],
            meta: {
              folder: 'images_shp',
              ext: 'dbf',
              filter: 'lasList',
              column: {
                name: 'id_point',
                seq: 'sequence',
                lat: 'Latitude',
                lon: 'Longitude',
                alt: 'altitude',
                heading: 'heading',
                x: 'x_utm',
                y: 'y_utm',
                roll: 'roll',
                pitch: 'pitch',
                lasList: 'file_las'
              },
              prefix: {
                front: '00',
                back: '01'
              },
              sep: '_'
            }
          },
          pointcloud: {
            formats: [
              { type: 'pcd', folder: 'pointcloud', ext: 'las' },
              { type: 'depthmap', folder: 'images_depthmap_point', ext: 'bin' }
            ],
            meta: {
              folder: 'pointcloud_shp',
              ext: 'dbf',
              column: {
                name: 'file_las'
              }
            }
          }
        },
        {
          name: 'snap2',
          folder: 'snap2',
          image: {
            formats: [
              { type: 'img', folder: 'images', ext: 'jpg' },
              { type: 'depthmap', folder: 'images_depthmap', ext: 'bin' }
            ],
            meta: {
              folder: 'images_shp',
              ext: 'dbf',
              filter: 'lasList',
              column: {
                name: 'id_point',
                seq: 'sequence',
                lat: 'Latitude',
                lon: 'Longitude',
                alt: 'altitude',
                heading: 'heading',
                x: 'x_utm',
                y: 'y_utm',
                roll: 'roll',
                pitch: 'pitch',
                lasList: 'file_las'
              },
              prefix: {
                front: '00',
                back: '01'
              },
              sep: '_'
            }
          },
          pointcloud: {
            formats: [
              { type: 'pcd', folder: 'pointcloud', ext: 'las' },
              { type: 'depthmap', folder: 'images_depthmap_point', ext: 'bin' }
            ],
            meta: {
              folder: 'pointcloud_shp',
              ext: 'dbf',
              column: {
                name: 'file_las'
              }
            }
          }
        }
      ]
    }
  else if (round === 'imms_20200909_231253')
    roundObj = {
      name: 'imms_20200909_231253',
      nas: { id: '10.2.0.108' },
      root: 'mms_test2/2020_imms/00_proj_hdmap/01_cto_output/Daejeon_KAIST/imms_20200909_231253',
      snaps: [
        {
          name: 'snap1',
          folder: 'snap1',
          image: {
            formats: [
              { type: 'img', folder: 'images', ext: 'jpg' },
              { type: 'depthmap', folder: 'images_depthmap', ext: 'bin' }
            ],
            meta: {
              folder: 'images_shp',
              ext: 'dbf',
              filter: 'lasList',
              column: {
                name: 'id_point',
                seq: 'sequence',
                lat: 'Latitude',
                lon: 'Longitude',
                alt: 'altitude',
                heading: 'heading',
                x: 'x_utm',
                y: 'y_utm',
                roll: 'roll',
                pitch: 'pitch',
                lasList: 'file_las'
              },
              prefix: {
                front: '00',
                back: '01'
              },
              sep: '_'
            }
          },
          pointcloud: {
            formats: [
              { type: 'pcd', folder: 'pointcloud', ext: 'las' },
              { type: 'depthmap', folder: 'images_depthmap_point', ext: 'bin' }
            ],
            meta: {
              folder: 'pointcloud_shp',
              ext: 'dbf',
              column: {
                name: 'file_las'
              }
            }
          }
        },
        {
          name: 'snap2',
          folder: 'snap2',
          image: {
            formats: [
              { type: 'img', folder: 'images', ext: 'jpg' },
              { type: 'depthmap', folder: 'images_depthmap', ext: 'bin' }
            ],
            meta: {
              folder: 'images_shp',
              ext: 'dbf',
              filter: 'lasList',
              column: {
                name: 'id_point',
                seq: 'sequence',
                lat: 'Latitude',
                lon: 'Longitude',
                alt: 'altitude',
                heading: 'heading',
                x: 'x_utm',
                y: 'y_utm',
                roll: 'roll',
                pitch: 'pitch',
                lasList: 'file_las'
              },
              prefix: {
                front: '00',
                back: '01'
              },
              sep: '_'
            }
          },
          pointcloud: {
            formats: [
              { type: 'pcd', folder: 'pointcloud', ext: 'las' },
              { type: 'depthmap', folder: 'images_depthmap_point', ext: 'bin' }
            ],
            meta: {
              folder: 'pointcloud_shp',
              ext: 'dbf',
              column: {
                name: 'file_las'
              }
            }
          }
        }
      ]
    }
  for (const snapObj of roundObj.snaps) snapObj.marks = await getTable(roundObj.name, snapObj.name, snapObj.image.meta)
  for (const snapObj of roundObj.snaps) snapObj.areas = await getTable(roundObj.name, snapObj.name, snapObj.pointcloud.meta)
  res.json(roundObj)
}

export default router
