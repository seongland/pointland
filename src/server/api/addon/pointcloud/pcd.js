import { mkdir } from 'fs'
import { getRootByRound } from '../tool/round'

export function lasPath(req) {
  const round = req.params.round
  const snap = req.params.snap
  const area = req.params.area
  const root = getRootByRound(round)
  return `${root}\\${snap}\\pointcloud\\${area}`
}

export function cachePath(req) {
  const round = req.params.round
  const snap = req.params.snap
  const area = req.params.area
  const root = process.cwd()
  const snapPath = `${root}\\cache\\${round}\\${snap}\\${area}`
  mkdir(snapPath, { recursive: true }, () => ({}))
  return snapPath
}
