/*
 * @summary - Local Storage Module
 */

export const state = () => ({
  camera: {
    position: null,
    target: null,
  },
})

export const mutations = {
  setCamera(state, { position, target }) {
    state.camera = { position, target }
  },
}
