import { updateCtrl } from '~/plugins/cloud/meta'

const WAIT_RENDER = 500

export const state = () => ({
  accessToken: undefined,
  user: undefined,
  prj: undefined,
  prjId: undefined,
  index: 1,
  currentRound: {
    name: 'imms_20200825_170217',
    snaps: [
      { name: 'snap1', count: 1017 },
      { name: 'snap2', count: 1017 }
    ]
  },
  currentSnap: { name: 'snap1', count: 1017 },
  currentSeq: 0,
  rounds: [
    {
      name: 'imms_20200825_170217',
      snaps: [
        { name: 'snap1', count: 1017 },
        { name: 'snap2', count: 1017 }
      ]
    },
    {
      name: 'imms_20200824_193802',
      snaps: [
        { name: 'snap1', count: 1017 },
        { name: 'snap2', count: 1017 }
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
    this.$router.push('/')
  },

  setIndex(state, index) {
    /**
     * @summary - change tab  & resize because of canvas error
     */
    if (state.index === index) return
    const previous = state.index
    state.index = index
    const mapWrapper = document.getElementById('global-map').parentElement
    setTimeout(() => window.dispatchEvent(new Event('resize')))

    if (previous === 0) {
      mapWrapper.style.opacity = 0
      setTimeout(() => {
        mapWrapper.classList.add('small-map')
        setTimeout(() => {
          mapWrapper.style.opacity = 1
          mapWrapper.style.transitionDuration = '500ms'
          window.dispatchEvent(new Event('resize'))
        }, WAIT_RENDER)
      })
    } else if (index === 0) mapWrapper.classList.remove('small-map')

    if (index === 2) setTimeout(() => updateCtrl())
  },

  setRound: (state, round) => (state.currentRound = round),
  setSnap: (state, snap) => (state.currentSnap = snap),
  setSeq(state, seq) {
    if (seq < 0) return
    if (seq >= state.currentSnap.count) return
    state.currentSeq = seq
  }
}
