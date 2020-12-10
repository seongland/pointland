import { ref } from '../../app'

export async function getRoundWithRoot(round) {
  const app = ref.app
  const service = app.service('rounds')
  const roundObj = await service.Model.findOne({ name: round })
  roundObj.root = `/mnt/${roundObj.nas.ip}/${roundObj.root}`
  return roundObj
}
