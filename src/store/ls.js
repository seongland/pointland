import { updateCtrl } from '~/plugins/cloud/init'
import { ref as cloudRef } from '~/plugins/cloud/init'
import { drawXYZ } from '~/plugins/cloud/draw'

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
  rounds: [{ name: 'imms_20200909_231253' }, { name: 'imms_20200909_231253' }]
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
    state.currentMark = 0
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

  setRound(state, roundObj) {
    state.currentRound = roundObj
    const snapObj = roundObj.snaps[0]
    this.commit('ls/setSnap', snapObj)
    setTimeout(() => {
      for (const mark of snapObj.marks) drawXYZ(cloudRef.markLayer, [mark.x, mark.y, mark.alt], false)
    }, 2000)
  },
  setSnap(state, snapObj) {
    state.currentSnap = snapObj
    const markObj = snapObj.marks[0]
    this.commit('ls/setMark', markObj)
  },
  setMark(state, mark) {
    state.currentMark = mark
  }
}
