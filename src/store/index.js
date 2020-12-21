export const state = () => ({
  loading: false
})

export const mutations = {
  setLoading(state, value) {
    state.loading = value
  },

  setState(state, { props, value }) {
    let target = state
    for (const i in props)
      if (Number(i) === props.length - 1) target[props[i]] = value
      else target = target[props[i]]
  }
}

export const actions = {}
