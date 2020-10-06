import { updateCtrl } from "~/plugins/cloud/meta"

export const state = () => ({
  accessToken: undefined,
  user: undefined,
  prj: undefined,
  prjId: undefined,
  index: 0,
  currentRound: {
    name: 'imms_20200825_170217',
    snaps: [
      {
        name: 'snap1',
        count: 1017
      },
      {
        name: 'snap2',
        count: 1017
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
          name: 'snap1',
          count: 1017
        },
        {
          name: 'snap2',
          count: 1017
        }
      ]
    },
    {
      name: 'imms_20200824_193802',
      snaps: [
        {
          name: 'snap1',
          count: 1017
        },
        {
          name: 'snap2',
          count: 1017
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
    state.accessToken = undefined
    state.user = undefined
    state.prj = undefined
    state.prjId = undefined
    state.index = 0
    state.currentSeq = 0
    this.$router.push("/")
  },

  setIndex(state, index) {
  /**
   * @summary - change tab  & resize because of canvas error
   */
    state.index = index
    if (index !== 1)
      setTimeout(() => window.dispatchEvent(new Event('resize')))
    if (index === 2)
      setTimeout(() => updateCtrl())
  },

  changeRound(state, round) {
    state.currentRound = round
  },
  changeSnap(state, snap) {
    state.currentSnap = snap
  },
  changeSeq(state, seq) {
    if (seq < 0) return
    if (seq >= state.currentSnap.count) return
    state.currentSeq = seq
  }
}
