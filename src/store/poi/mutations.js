export default {
  add(state, { text }) {
    state.list.push({
      text,
      done: false
    })
  },

  toggle(state, poi) {
    poi.done = !poi.done
  }
}
