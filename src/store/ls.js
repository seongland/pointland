import { updateCtrl } from '~/plugins/cloud/init'

const WAIT_RENDER = 500

export const state = () => ({
  accessToken: undefined,
  user: undefined,
  prj: undefined,
  prjId: undefined,
  index: 0,
  currentRound: undefined,
  currentSnap: undefined,
  currentMark: undefined,
  rounds: [{ name: 'imms_20200909_231253' }, { name: 'imms_20200910_000230' }]
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
    state.rounds = [{ name: 'imms_20200909_231253' }, { name: 'imms_20200910_000230' }]
    state.currentMark = undefined
    state.currentSnap = undefined
    state.currentRound = undefined
    this.$router.push('/')
  },

  setIndex(state, index) {
    /**
     * @summary - change tab  & resize because of canvas error
     */
    if (state.index === index) return
    const previous = state.index
    state.index = index
    const mapWrapper = document.getElementById('global-map')?.parentElement
    if (!mapWrapper) return
    setTimeout(() => window.dispatchEvent(new Event('resize')))

    if (previous === 0) {
      mapWrapper.style.opacity = 0
      setTimeout(() => {
        mapWrapper.classList.add('small-map')
        mapWrapper.classList.add('bottom')
        mapWrapper.classList.add('left')
        setTimeout(() => {
          mapWrapper.style.opacity = 1
          mapWrapper.style.transitionDuration = '500ms'
          window.dispatchEvent(new Event('resize'))
        }, WAIT_RENDER)
      })
    } else if (index === 0) {
      mapWrapper.classList.remove('small-map')
    }

    if (index === 2) setTimeout(() => updateCtrl())
  },

  setRounds(state, rounds) {
    const roundIndex = state.rounds.findIndex(element => element.name === state.currentRound?.name)
    state.rounds = rounds

    let roundObj
    if (roundIndex >= 0) roundObj = rounds[roundIndex]
    if (!roundObj) roundObj = rounds[0]

    this.$router.app.setRound(roundObj)
  },

  setRound(state, roundObj) {
    let snapIndex
    if (state.currentRound?.snaps)
      snapIndex = state.currentRound.snaps.findIndex(element => element.name === state.currentSnap.name)
    state.currentRound = roundObj

    let snapObj
    if (snapIndex >= 0 && state.currentSnap.round === roundObj.name) snapObj = roundObj.snaps[snapIndex]
    if (!snapObj) snapObj = roundObj.snaps[0]

    this.$router.app.setSnap(snapObj)
  },

  setSnap(state, snapObj) {
    this.$router.app.resetSnap()
    snapObj.round = state.currentRound.name
    let markIndex
    if (state.currentSnap?.marks)
      markIndex = state.currentSnap.marks.findIndex(element => element.name === state.currentMark.name)
    state.currentSnap = snapObj

    let markObj
    if (markIndex >= 0 && state.currentMark.snap === snapObj.name) markObj = snapObj.marks[markIndex]
    if (!markObj) markObj = snapObj.marks[0]

    this.$router.app.setMark(markObj)
  },

  setMark(state, markObj) {
    if (!markObj) return
    markObj.snap = state.currentSnap.name
    state.currentMark = markObj
  }
}
