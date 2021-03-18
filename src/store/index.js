export const state = () => ({
  loading: false,
  snackbar: { messages: [] }
})

export const mutations = {
  setLoading(state, value) {
    /**
     * @summary - set global loading state
     */
    state.loading = value
  },

  snack(state, { message = 'Success', color = 'darkgrey', timeout = 2000 }) {
    /**
     * @summary - send messages to snackbar and log
     */
    const msgObj = { message, color, timeout }
    state.snackbar.open = true
    state.snackbar.messages.push(msgObj)
  },

  setState(state, { props, value }) {
    let target = state
    for (const i in props)
      if (Number(i) === props.length - 1) target[props[i]] = value
      else target = target[props[i]]
  }
}
