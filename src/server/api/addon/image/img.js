/*
 * <summary>img file functions</summary>
 */

import { getRoundWithRoot, getSnapFromRound, getFormatFromSnap } from '../tool/round'
import consola from 'consola'

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

  const snapObj = getSnapFromRound(roundObj, snap)
  const imgMeta = snapObj.image.meta

  const imgFormat = getFormatFromSnap(snapObj, type)
  const ext = imgFormat.ext
  let prefix = imgMeta.prefix[direction]
  let index = imgMeta.direction ? imgMeta.direction[direction] : prefix

  const snapPath = `${root}/${snap}`
  const parent = snapObj.image.parent ? `${snapObj.image.parent}[${index}]/` : ''
  const formatPath = `${snapPath}/${parent}${imgFormat.folder}`

  let fileName
  if (imgMeta.indexing === 'bracket') fileName = `${prefix}${imgMeta.sep}[${mark}].${ext}`
  else fileName = `${prefix}${imgMeta.sep}${mark}.${ext}`

  const filePath = `${formatPath}/${fileName}`

  if (process.env.target === 'move') consola.info(filePath)
  return filePath
}
