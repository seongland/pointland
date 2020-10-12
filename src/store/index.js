import { setDrawInteraction } from '~/plugins/map/draw'

export const state = () => ({
  drawLayer: { index: undefined, layerObj: undefined },
  selected: []
})

export const mutations = {
  setLayer(state, { index, layerObj }) {
    if (index === undefined && layerObj === undefined) {
      state.drawLayer.index = undefined
      state.drawLayer.layerObj = undefined
    }
    if (index !== undefined) state.drawLayer.index = index
    if (layerObj !== undefined) {
      state.drawLayer.layerObj = layerObj
      setDrawInteraction(layerObj)
    }
  },

  select(state, { xyz, latlng, point }) {
    const slected = {}
  }
}
