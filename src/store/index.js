import { setDrawInteraction } from '~/plugins/map/draw'

export const state = () => ({
  targetLayer: { index: undefined, object: undefined },
  loading: true,
  depth: {
    loading: false,
    on: true
  },
  selected: []
})

export const mutations = {
  setLayer(state, { index, object }) {
    if (index === undefined && object === undefined) {
      state.targetLayer.index = undefined
      state.targetLayer.object = undefined
    }
    if (index !== undefined) state.targetLayer.index = index
    if (object !== undefined) {
      state.targetLayer.object = object
      // setDrawInteraction(object)
    }
  },

  setDepthLoading: (state, value) => (state.depth.loading = value),
  toggleDepth: state => (state.depth.on = !state.depth.on),

  select(state, { xyz, latlng, point }) {
    const slected = {}
  },

  setLoading(state, value) {
    state.loading = value
  }
}
