import proj4 from 'proj4'
import jimp from 'jimp-compact'
import { DBFFile } from 'dbffile'
import { WGS84, EPSG32652 } from './const'

export async function getDbfRecord(dbfPath, seq) {
  let records = await getDbfRecords(dbfPath)
  for (let record of records) {
    if (record.id_point == seq) return record
  }
}

export async function getDbfRecords(dbfPath) {
  const dbf = await DBFFile.open(dbfPath)
  return await dbf.readRecords(dbf.recordCount)
}

export function dbfPath(round, snap) {
  const root = getRootByRound(round)
  const ext = 'dbf'
  return `${root}\\${snap}\\images_shp\\[${round}]${snap}.${ext}`
}

export function getRootByRound(round) {
  return `\\\\10.1.0.112\\mms_test2\\2020_imms\\00_proj_hdmap\\01_cto_output\\Daejeon_KAIST\\${round}`
}

export function getDistance(x1, y1, z1, x2, y2, z2) {
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2) + Math.pow(z1 - z2, 2))
}

export function to32652(lon, lat) {
  console.log(lon, lat)
  return proj4(WGS84, EPSG32652, [parseFloat(lon), parseFloat(lat)])
}

export function color(distance) {
  let ratio
  if (distance < 50) ratio = (50 - distance) / 50
  else ratio = 1
  return jimp.rgbaToInt(255 * ratio, 255 * ratio, 255 * ratio, 255)
}
