import express from 'express'
import dotenv from 'dotenv'
import { getImgTable } from './mark/image'

dotenv.config()
const router = express.Router()

router.get('/:round', round)

async function round(req, res) {
  const roundObj = {
    name: 'imms_20200909_231253',
    root: '\\\\10.1.0.112\\mms_test2\\2020_imms\\00_proj_hdmap\\01_cto_output\\Daejeon_KAIST\\imms_20200909_231253',
    projects: ['Daejeon_KAIST'],
    snaps: [
      {
        name: 'snap1',
        folder: 'snap1',
        image: {
          img: { folder: 'images', ext: 'jpg' },
          depthmap: { folder: 'images_depthmap', ext: 'bin' },
          data: {
            folder: 'images_shp',
            ext: 'dbf',
            column: {
              name: 'id_point'
            },
            prefix: {
              front: '00',
              back: '01'
            },
            sep: '_'
          }
        },
        pointcloud: {
          pcd: { folder: 'pointcloud', ext: 'jpg' },
          depthmap: { folder: 'images_depthmap_point', ext: 'bin' },
          data: {
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
  for (const snapObj of roundObj.snaps) snapObj.image.data.table = await getImgTable(roundObj.name, snapObj.name)
  res.json(roundObj)
}

export default router
