/*
 * <summary>img file functions</summary>
 */

import { getRoundWithRoot } from '../tool/round'

export async function imagePath(req) {
  /*
   * <summary>index file from js</summary>
   */
  const round = req.params.round
  const snap = req.params.snap
  const mark = req.params.mark
  const direction = req.params.direction

  return await getImgPathByType(round, snap, mark, direction, 'img')
}

export async function depthmapPath(req) {
  /*
   * <summary>index file from js</summary>
   */

  const round = req.params.round
  const snap = req.params.snap
  const mark = req.params.mark
  const direction = req.params.direction

  return await getImgPathByType(round, snap, mark, direction, 'depthmap')
}

async function getImgPathByType(round, snap, mark, direction, type) {
  const roundObj = await getRoundWithRoot(round)
  const root = roundObj.root

  let snapObj
  for (const tmpSnap of roundObj.snaps)
    if (tmpSnap.name === snap) {
      snapObj = tmpSnap
      break
    }
  const imgMeta = snapObj.image.meta

  let imgFormat
  for (const tmpFormat of snapObj.image.formats)
    if (tmpFormat.type === type) {
      imgFormat = tmpFormat
      break
    }

  const ext = imgFormat.ext
  let prefix = imgMeta.prefix[direction]
  return `${root}/${snap}/${imgFormat.folder}/${prefix}${imgMeta.sep}${mark}.${ext}`
}
