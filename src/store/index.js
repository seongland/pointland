import { setDrawInteraction } from '~/plugins/map/draw'
import { xyto84 } from '~/server/api/addon/tool/coor'
import { ref as imgRef } from '~/plugins/image/init'

export const state = () => ({
  drawing: { index: undefined, type: undefined, types: [{ type: 'Point' }] },
  targetLayer: { index: undefined, object: undefined },
  allowedLayers: ['B1', 'C1'],
  loading: true,
  depth: {
    loading: false,
    on: true
  },
  submit: {
    show: false,
    ing: false,
    loading: false
  },
  edit: {
    show: false,
    ing: false,
    id: undefined,
    loading: false
  },
  delete: {
    ing: false,
    id: undefined,
    loading: false
  },
  selected: []
})

export const mutations = {
  setLayer(state, { index, object }) {
    if (index === undefined && object === undefined) {
      state.targetLayer.index = undefined
      state.targetLayer.object = undefined
    }
    if (index !== undefined) state.targetLayer.index = index
    if (object !== undefined) {
      state.targetLayer.object = object
      // setDrawInteraction(object)
    }
  },
  selectFeature(state, feature) {
    state.selected = [feature]
  },
  resetSelected(state) {
    state.selected = []
  },
  setLoading(state, value) {
    state.loading = value
  },
  setDepthLoading: (state, value) => (state.depth.loading = value),

  setState(state, { props, value }) {
    let target = state
    for (const prop of props) target = target[prop]
    target = value
  },

  select(state, { xyz, images, pointclouds, type }) {
    const feature = {
      relations: {
        images: [],
        pointclouds: []
      },
      geometry: {},
      properties: {
        x: xyz[0],
        y: xyz[1],
        z: xyz[2]
      }
    }
    if (type === 'Point')
      feature.geometry = {
        type: 'Point',
        coordinates: xyto84(xyz[0], xyz[1])
      }
    if (images?.length > 0) feature.relations.images.push(...images)
    if (pointclouds?.length > 0) feature.relations.pointclouds.push(...pointclouds)
    state.selected = [feature]
  }
}

export const actions = {
  async submit({ commit, state }, { comment, args, type }) {
    const app = this.$router.app
    commit('setState', { props: ['submit', 'loading'], value: true })
    let feature
    if (type === 'Point') {
      feature = state.selected[0]
      feature.properties.comment = comment
      if (args) for (const key of Object.keys(args)) feature.properties[key] = args[key]
    }
    feature.relations.maker = state.ls.user.email

    if (process.env.dev) console.log('Result Feature', feature)
    const res = await this.$axios.post('/api/facility', feature, {
      headers: { 'Content-Type': 'application/json', Authorization: state.ls.accessToken }
    })
    commit('setState', { props: ['submit', 'loading'], value: false })
    if (res.status === 201) {
      commit('setState', { props: ['submit', 'ing'], value: false })
      commit('setState', { props: ['submit', 'show'], value: false })
      app.resetSelected()
      app.drawnFacilities(state.ls.currentMark, imgRef.depth)
    } else return
  },

  async remove({ commit }, id) {
    commit('setState', { props: ['del', 'loading'], value: true })
    const app = this.$router.app
    const config = app.getAuthConfig()
    const res = await this.$axios.delete(`/api/facility/${id}`, config)
    commit('setState', { props: ['del', 'ing'], value: false })
    commit('setState', { props: ['del', 'loading'], value: false })
    app.removeVector('drawnLayer', id)
    app.resetSelected()
    if (process.env.dev) console.log('Removed', res.data)
  },

  async edit({ commit }, id, facility) {
    commit('setState', { value: true, props: ['edit', 'loading'] })
    const app = this.$router.app
    const config = app.getAuthConfig()
    config.data = facility
    const res = await this.$axios.patch(`/api/facility/${id}`, config)
    commit('setState', { props: ['edit', 'ing'], value: false })
    commit('setState', { props: ['edit', 'show'], value: false })
    commit('setState', { value: false, props: ['edit', 'loading'] })
    app.resetSelected()
    if (process.env.dev) console.log('Edited', res.data)
  }
}
