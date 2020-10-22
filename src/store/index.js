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
    ing: false
  },
  edit: {
    ing: false,
    id: undefined
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

  setShowSubmit(state, value) {
    state.submit.show = value
  },
  setSubmitting(state, value) {
    state.submit.ing = value
  },
  setEditing(state, value) {
    state.edit.ing = value
  },
  setEditTarget(state, id) {
    state.edit.id = id
  },

  async submit(state, { comment, args, type }) {
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
    if (res.status === 201) {
      this.commit('setShowSubmit', false)
      this.$router.app.resetSelected()
      this.$router.app.drawFacilities(state.ls.currentMark, imgRef.depth)
    } else return
  },

  setDepthLoading: (state, value) => (state.depth.loading = value),

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
  },

  resetSelected(state) {
    state.selected = []
  },

  setLoading(state, value) {
    state.loading = value
  }
}

export const actions = {
  async remove({ state, commit }, id) {
    const app = this.$router.app
    const config = app.getAuthConfig()
    const res = await this.$axios.delete(`/api/facility/${id}`, config)
    commit('setEditing', false)
    if (process.env.dev) console.log('Removed', res.data)
  }
}
