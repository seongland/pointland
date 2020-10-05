export const state = () => ({
  accessToken: undefined,
  user: undefined,
  prj: undefined,
  prjId: undefined,
  currentRound: {
    name: 'imms_20200825_170217',
    snaps: [
      {
        name: 'snap1'
      }
    ]
  },
  currentSnap: {
    name: 'snap1',
    count: 1017
  },
  currentSeq: 0,
  rounds: [
    {
      name: 'imms_20200825_170217',
      snaps: [
        {
          name: 'snap1'
        }
      ]
    }
  ]
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

  changeRound(state, round) { },
  changeSnap(state, snap) { },
  changeSeq(state, seq) {
    state.currentSeq = seq
  }
}
