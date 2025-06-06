import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loading: false,
    snackbar: { messages: [] },
  },
  mutations: {
    setLoading(state, value) {
      state.loading = value
    },
    snack(state, { message = 'Success', color = 'darkgrey', timeout = 2000 }) {
      const msgObj = { message, color, timeout }
      state.snackbar.open = true
      state.snackbar.messages.push(msgObj)
    },
    setState(state, { props, value }) {
      let target = state
      for (const i in props)
        if (Number(i) === props.length - 1) target[props[i]] = value
        else target = target[props[i]]
    },
  },
})
