<template>
  <div style="background: #000">
    <v-row>
      <v-toolbar color="grey darken-4" dense>
        <v-slider class="pt-5 px-5" label="Opacity" v-model="opacity" :max="1" :min="0" step="0.01" @change="setOpacity" />
      </v-toolbar>
    </v-row>
    <v-row>
      <v-col cols="6" md="6" sm="6" class="py-0 px-0">
        <transition name="fade" appear>
          <v-img :src="src.front.uri" v-show="!loading">
            <v-img
              id="front"
              v-show="show"
              :src="depth ? depth.front.uri : src.front.uri"
              @click="imageClick($event, depth)"
            >
              <v-img :src="depth ? depth.front.layer.drawn.uri : src.front.uri">
                <v-img :src="depth ? depth.front.layer.selected.uri : src.front.uri"
              /></v-img>
            </v-img>
          </v-img>
        </transition>
      </v-col>
      <v-col cols="6" md="6" sm="6" class="py-0 px-0">
        <transition name="fade" appear>
          <v-img :src="src.back.uri" v-show="!loading">
            <v-img id="back" v-show="show" :src="depth ? depth.back.uri : src.back.uri" @click="imageClick($event, depth)">
              <v-img :src="depth ? depth.back.layer.drawn.uri : src.back.uri">
                <v-img :src="depth ? depth.back.layer.selected.uri : src.back.uri" />
              </v-img>
            </v-img>
          </v-img>
        </transition>
      </v-col>
    </v-row>
    <v-spacer />
    <v-row> </v-row>
  </div>
</template>

<script>
import { resetPointLayer } from '~/plugins/cloud/event'
import { ref as cloudRef } from '~/plugins/cloud/init'

export default {
  data: () => ({
    opacity: 1
  }),

  computed: {
    src() {
      const ls = this.$store.state.ls
      if (!ls.currentRound || !ls.currentSnap || !ls.currentMark)
        return { front: { uri: undefined }, back: { uri: undefined } }
      const root = `/api/image/${ls.currentRound.name}/${ls.currentSnap.name}/${ls.currentMark.name}`
      return { front: { uri: `${root}/front` }, back: { uri: `${root}/back` } }
    },
    show() {
      const depth = this.$store.state.depth
      return !depth.loading
    },
    loading() {
      return this.$store.state.depth.loading
    }
  },

  asyncComputed: {
    async depth() {
      this.$store.commit('setDepthLoading', true)
      const currentMark = this.$store.state.ls.currentMark
      if (!currentMark)
        return {
          front: { uri: undefined, layer: { selected: { uri: undefined }, drawn: { uri: undefined } } },
          back: { uri: undefined, layer: { selected: { uri: undefined }, drawn: { uri: undefined } } }
        }
      const frontURL = `${this.src.front.uri}/depth`
      const backURL = `${this.src.back.uri}/depth`
      const frontP = this.$axios.post(frontURL, { data: { mark: currentMark } })
      const backP = this.$axios.post(backURL, { data: { mark: currentMark } })
      const [f, b] = await Promise.all([frontP, backP])
      const [front, back] = [f.data, b.data]

      const depth = this.initImg({ front, back })
      this.drawFacilities(currentMark, depth)

      front.url = frontURL
      back.url = backURL
      this.$store.commit('setDepthLoading', false)
      return depth
    }
  },

  methods: {
    setOpacity(opacity) {
      const front = document.getElementById('front')
      const back = document.getElementById('back')
      for (const child of front.children) if (child.children.length === 0) child.style.opacity = opacity
      for (const child of back.children) if (child.children.length === 0) child.style.opacity = opacity
    }
  }
}
</script>

<style></style>
