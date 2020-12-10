import { ref } from '../../app'

export async function getRoundWithRoot(round) {
  const app = ref.app
  const service = app.service('rounds')
  const roundObj = await service.Model.findOne({ name: round })
  roundObj.root = `/mnt/${roundObj.nas.ip}/${roundObj.root}`
  return roundObj
}

export function getSnapFromRound(roundObj, snap) {
  for (const tmpSnap of roundObj.snaps) if (tmpSnap.name === snap) return tmpSnap
}

export function getFormatFromSnap(snapObj, type) {
  for (const tmpFormat of snapObj.image.formats) if (tmpFormat.type === type) return tmpFormat
  for (const tmpFormat of snapObj.pointcloud.formats) if (tmpFormat.type === type) return tmpFormat
}
