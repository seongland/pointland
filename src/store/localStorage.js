export const state = () => ({
  accessToken: undefined,
  lastPage: "map",

  user: undefined,
  prj: undefined,
  org: undefined
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

  setOrg(state, org) {
    state.org = org
  },

  setPrj(state, prj) {
    state.prj = prj
  }
}
