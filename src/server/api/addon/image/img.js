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

  const roundObj = await getRoundWithRoot(round)
  const root = roundObj.root
  const ext = 'jpg'
  let dir
  if (direction === 'front') dir = '00'
  if (direction === 'back') dir = '01'
  return `${root}/${snap}/images_enhance/${dir}_${mark}.${ext}`
}

export async function depthmapPath(req) {
  /*
   * <summary>index file from js</summary>
   */

  const round = req.params.round
  const snap = req.params.snap
  const mark = req.params.mark
  const direction = req.params.direction

  const roundObj = await getRoundWithRoot(round)
  const root = roundObj.root
  const ext = 'bin'
  let dir
  if (direction === 'front') dir = '00'
  if (direction === 'back') dir = '01'
  return `${root}/${snap}/images_depthmap2/${dir}_${mark}.${ext}`
}
