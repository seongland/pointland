/*
 * <summary>img file functions</summary>
 */

import { getRootByRound } from '../tool/round'

export function imagePath(req) {
  /*
   * <summary>index file from js</summary>
   */
  const round = req.params.round
  const snap = req.params.snap
  const mark = req.params.mark
  const direction = req.params.direction

  const root = getRootByRound(round)
  const ext = 'jpg'
  let dir
  if (direction === 'front') dir = '00'
  if (direction === 'back') dir = '01'
  return `${root}\\${snap}\\images_enhance\\${dir}_${mark}.${ext}`
}

export function depthmapPath(req) {
  /*
   * <summary>index file from js</summary>
   */

  const round = req.params.round
  const snap = req.params.snap
  const mark = req.params.mark
  const direction = req.params.direction

  const root = getRootByRound(round)
  const ext = 'bin'
  let dir
  if (direction === 'front') dir = '00'
  if (direction === 'back') dir = '01'
  return `${root}\\${snap}\\images_depthmap\\${dir}_${mark}.${ext}`
}
