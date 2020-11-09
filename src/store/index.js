import { xyto84 } from '~/server/api/addon/tool/coor'
import { ref as imgRef } from '~/plugins/image/init'
import { ref as cloudRef } from '~/plugins/cloud/init'

export const state = () => ({
  drawing: { index: undefined, type: undefined, types: [{ type: 'Point' }] },
  allowedLayers: ['B1', 'C1'],
  facilities: [],
  loading: true,
  distance: { max: 50 },
  depth: { loading: false, on: true },
  submit: { show: false, ing: false, loading: false },
  edit: { show: false, ing: false, id: undefined, loading: false },
  del: { ing: false, id: undefined, loading: false },
  selected: [],
  history: []
})

export const mutations = {
  selectFeature(state, feature) {
    state.selected = [feature]
  },
  resetSelected(state) {
    state.selected = []
    if (cloudRef.cloud) cloudRef.cloud.transform.detach(cloudRef.selectedLayer)
  },
  setLoading(state, value) {
    state.loading = value
  },
  setDepthLoading: (state, value) => (state.depth.loading = value),

  setState(state, { props, value }) {
    let target = state
    for (const i in props)
      if (Number(i) === props.length - 1) target[props[i]] = value
      else target = target[props[i]]
  },

  select(state, { xyz, images, pointclouds, type }) {
    const feature = {
      relations: { images: [], pointclouds: [] },
      geometry: {},
      properties: { x: xyz[0], y: xyz[1], z: xyz[2] }
    }
    if (type === 'Point') feature.geometry = { type: 'Point', coordinates: xyto84(xyz[0], xyz[1]) }
    if (images?.length > 0) feature.relations.images.push(...images)
    if (pointclouds?.length > 0) feature.relations.pointclouds.push(...pointclouds)
    state.selected = [feature]
  },

  updateGeom(state, xyz) {
    state.selected[0].properties.x = xyz[0]
    state.selected[0].properties.y = xyz[1]
    state.selected[0].properties.z = xyz[2]
    state.selected[0].geometry.coordinates = xyto84(xyz[0], xyz[1])
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

    if (process.env.dev) console.log('Result Feature', feature)
    const config = app.getAuthConfig()
    const res = await this.$axios.post('/api/facility', feature, config)
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
    app.resetSelected()
    app.removeVector('drawnLayer', id)
    if (process.env.dev) console.log('Removed', res.data)
  },

  async edit({ commit, state }, facility) {
    commit('setState', { value: true, props: ['edit', 'loading'] })
    const app = this.$router.app
    const config = app.getAuthConfig()
    const res = await this.$axios.patch(`/api/facility/${facility.id}`, facility, config)
    commit('setState', { props: ['edit', 'ing'], value: false })
    commit('setState', { props: ['edit', 'show'], value: false })
    commit('setState', { props: ['edit', 'loading'], value: false })
    app.resetSelected()
    app.drawnFacilities(state.ls.currentMark, imgRef.depth)
    if (process.env.dev) console.log('Edited', res.data)
  }
}
