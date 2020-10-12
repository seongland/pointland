import { setDrawInteraction } from '~/plugins/map/draw'

export const state = () => ({
  drawLayer: { index: undefined, layerObj: undefined },
  loading: false,
  depth: {
    loading: false,
    on: true
  },
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
      // setDrawInteraction(layerObj)
    }
  },

  setDepthLoading: (state, value) => (state.depth.loading = value),
  toggleDepth: state => (state.depth.on = !state.depth.on),

  select(state, { xyz, latlng, point }) {
    const slected = {}
  },

  setLoading(state, value) {
    console.log(value)
    state.loading = value
  }
}
