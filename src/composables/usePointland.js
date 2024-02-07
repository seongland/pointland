import LayerSpace from 'layerspace'

const POSITION = [10, 130, 50]
const EPS = 1e-5

export default function usePointland(store, root) {
  function startLand() {
    const target = document.getElementById('pointland')
    const layerspace = new LayerSpace(target, root.spaceOpt)
    const space = layerspace.space
    root.$layerspace = layerspace
    setTimeout(() => store.commit('snack', { message: 'Welcome to Pointland' }), 1000)
    space.potree.loadPointCloud('cloud.json', (url) => `/potree/${url}`).then((pco) => loadPCO(pco, space))
    return layerspace
  }

  function loadPCO(pco, space) {
    store.commit('setLoading', false)
    space.offset = [pco.position.x, pco.position.y, pco.position.z]
    pco.translateX(-pco.position.x)
    pco.translateY(-pco.position.y)
    pco.translateZ(-pco.position.z)
    pco.translateX(-200)
    space.pointclouds.push(pco)
    space.scene.add(pco)
    pco.material.intensityRange = [0, 255]
    pco.material.maxSize = 40
    pco.material.minSize = 4
    pco.material.size = 1
    pco.material.shape = 1
    space.controls.setTarget(POSITION[0] + 7 * EPS, POSITION[1] - 1 * EPS, POSITION[2] - EPS, true)
    setTimeout(() => store.commit('snack', { message: 'Click Top Left Button for Help', timeout: 10000 }), 10000)
  }

  return { startLand }
}
