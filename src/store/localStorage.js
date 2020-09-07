export const state = () => ({
  accessToken: undefined,
  lastPage: "map",

  user: undefined,
  prj: undefined,
  prjId: undefined,
})

export const mutations = {
  login(state, { accessToken, user }) {
    state.user = user
    state.accessToken = accessToken
  },

  logout(state) {
    /**
     * @summary - Reset Token & Last Page
     */
    for (var key in state)
      state[key] = undefined
    this.$router.push("/")
  },

  setPrj(state, { id, prj, socket }) {
    socket?.emit('setPrj', id)
    state.prj = prj
    state.prjId = id
  }
}
