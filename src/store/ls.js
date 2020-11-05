/*
 * @summary - Local Storage Module
 */

import { setDrawInteraction } from '~/plugins/map/draw'
import { updateCtrl } from '~/plugins/cloud/init'

const WAIT_RENDER = 500
const rounds = [
  { name: 'imms_20200909_231253' },
  { name: 'imms_20200910_000230' },
  { name: 'imms_20201026_145535' },
  { name: 'imms_20201026_153812' }
]

export const state = () => ({
  /*
   * @summary - Default State
   */
  index: 1,
  accessToken: undefined,
  user: undefined,
  prj: undefined,
  prjId: undefined,
  currentRound: undefined,
  currentSnap: undefined,
  currentMark: undefined,
  targetLayer: { index: undefined, object: undefined },
  targetTask: undefined,
  rounds
})

export const mutations = {
  /*
   * @summary - Simple local storage mutations
   */
  login(state, { accessToken, user }) {
    state.user = user
    state.accessToken = accessToken
  },

  setLayer(state, { index, object }) {
    const app = this.$router.app
    if (index === undefined && object === undefined) {
      state.targetLayer.index = undefined
      state.targetLayer.object = undefined
      app.drawnFacilities(state.currentMark)
    }
    if (index !== undefined) state.targetLayer.index = index
    if (object !== undefined) {
      state.targetLayer.object = object
      setDrawInteraction(object)
      app.drawnFacilities(state.currentMark)
    }
  },

  logout(state) {
    /**
     * @summary - Reset Token & Last Page
     */
    state.accessToken = undefined
    state.user = undefined
    state.prj = undefined
    state.prjId = undefined
    state.index = 1
    state.rounds = rounds
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
        setTimeout(() => {
          mapWrapper.style.opacity = 1
          window.dispatchEvent(new Event('resize'))
        }, WAIT_RENDER)
      })
    } else if (index === 0) mapWrapper.classList.remove('small-map')

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
    const previous = state.currentSnap
    const app = this.$router.app
    if (process.env.dev) console.log('New Snap', snapObj)

    let markIndex
    if (state.currentSnap?.marks && state.currentMark)
      markIndex = state.currentSnap.marks.findIndex(element => element.name === state.currentMark.name)
    state.currentSnap = snapObj

    let markObj
    if (markIndex >= 0 && state.currentMark.snap === snapObj.name) markObj = snapObj.marks[markIndex]
    if (!markObj) markObj = snapObj.marks[0]

    if (!(previous && snapObj.name === previous.name && previous.round === snapObj.round)) {
      if (previous.areas) previous.areas = undefined
      if (previous.marks) previous.marks = undefined
    }
    app.setMark(markObj)
  },

  setMark(state, markObj) {
    if (!markObj) return
    if (process.env.dev) console.log('Mark', markObj)
    markObj.snap = state.currentSnap.name
    state.currentMark = markObj
  }
}
