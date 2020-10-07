import { mkdir } from 'fs'
import { getRoot } from './tool'

export function lasPath(req) {
  const round = req.params.round
  const snap = req.params.snap
  const seq = req.params.seq
  const root = getRoot(round)
  const ext = 'las'
  const seq6 = seq.toString().padStart(6, '0')
  return `${root}\\${snap}\\pointcloud\\STRYX_GEOXYZ_${seq6}.${ext}`
}
export function cachePath(req) {
  const round = req.params.round
  const snap = req.params.snap
  const seq = req.params.seq
  const root = process.cwd()
  const snapPath = `${root}\\cache\\${round}\\${snap}\\${seq}`
  mkdir(snapPath, { recursive: true }, () => ({}))
  return snapPath
}
