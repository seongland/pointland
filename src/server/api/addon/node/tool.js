import proj4 from 'proj4';
import jimp from 'jimp-compact';
import { DBFFile } from 'dbffile';
import { WGS84, EPSG32652 } from './const';

export async function getDbfRecord(dbfPath, seq) {
  const dbf = await DBFFile.open(dbfPath);
  let records = await dbf.readRecords(dbf.recordCount);
  for (let record of records) {
    if (record.sequence == seq)
      return record;
  }
}
export function dbfPath(req) {
  const round = req.params.round;
  const snap = req.params.snap;

  const root = getRoot(round);
  const ext = "dbf";
  return `${root}\\${snap}\\images_shp\\[${round}]${snap}.${ext}`;
}
export function getRoot(round) {
  return `\\\\10.1.0.113\\2020_aihub\\04_dataset_draw_tool\\${round}`;
}
export function getDistance(x1, y1, z1, x2, y2, z2) {
  return Math.sqrt(
    Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2) + Math.pow(z1 - z2, 2)
  );
}
export function to32652(lon, lat) {
  console.log(lon, lat);
  return proj4(WGS84, EPSG32652, [parseFloat(lon), parseFloat(lat)]);
}
export function color(distance) {
  let ratio;
  if (distance < 50)
    ratio = (50 - distance) / 50;

  else
    ratio = 1;
  return jimp.rgbaToInt(255 * ratio, 255 * ratio, 255 * ratio, 255);
}
