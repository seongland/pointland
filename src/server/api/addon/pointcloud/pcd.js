import { mkdir } from 'fs'
import { getRootByRound } from '../tool/round'

export function lasPath(req) {
  const round = req.params.round
  const snap = req.params.snap
  const zone = req.params.zone
  const root = getRootByRound(round)
  return `${root}/${snap}/pointcloud/${zone}`
}

export function lasToJson(lasPath, version) {
  if (version === '1.2') {
  }
}

export function cachePath(req) {
  const round = req.params.round
  const snap = req.params.snap
  const zone = req.params.zone
  const root = process.cwd()
  const snapPath = `${root}/cache/${round}/${snap}/${zone}`
  mkdir(snapPath, { recursive: true }, () => ({}))
  return snapPath
}
