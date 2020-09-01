export const state = () => ({
  accessToken: undefined
})

export const mutations = {
  login(state, accessToken) {
    state.accessToken = accessToken
  },
  logout(state) {
    /**
     * @summary - Reset Token & Last Page
     */
    state.accessToken = undefined
    this.$router.push("/")
  }
}
