<template>
  <div style="background: #000">
    <v-row>
      <v-toolbar color="grey darken-4" dense>
        <v-slider
          class="pt-5 px-5"
          label="Depth"
          v-model="opacity.depth"
          :max="1"
          :min="0"
          step="0.01"
          @change="setDepthOpacity"
        />
        <v-slider
          class="pt-5 px-5"
          label="Layer"
          v-model="opacity.layer"
          :max="1"
          :min="0"
          step="0.01"
          @change="setLayerOpacity"
        />
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
              <v-img id="frontLayer" :src="depth ? depth.front.layer.drawn.uri : src.front.uri">
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
              <v-img id="backLayer" :src="depth ? depth.back.layer.drawn.uri : src.back.uri">
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
import { ref as imgRef } from '~/plugins/image/init'
import { updateImg } from '~/plugins/image/draw'

export default {
  data: () => ({
    opacity: { depth: 1, layer: 1 },
    depth: {
      front: { uri: undefined, layer: { selected: { uri: undefined }, drawn: { uri: undefined } } },
      back: { uri: undefined, layer: { selected: { uri: undefined }, drawn: { uri: undefined } } }
    }
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
    },
    currentMark() {
      return this.$store.state.ls.currentMark
    }
  },

  watch: {
    async currentMark(markObj) {
      this.setDepth(markObj)
    }
  },

  methods: {
    setDepthOpacity(opacity) {
      const front = document.getElementById('front')
      const back = document.getElementById('back')
      for (const child of front.children) if (child.children.length === 0) child.style.opacity = opacity
      for (const child of back.children) if (child.children.length === 0) child.style.opacity = opacity
    },
    setLayerOpacity(opacity) {
      const front = document.getElementById('frontLayer')
      const back = document.getElementById('backLayer')
      for (const child of front.children) if (child.children.length === 0) child.style.opacity = opacity
      for (const child of back.children) if (child.children.length === 0) child.style.opacity = opacity
    },

    async setDepth(currentMark) {
      const state = this.$store.state
      const ls = this.$store.state.ls
      if (!ls.accessToken) return

      this.$store.commit('setDepthLoading', true)
      const frontURL = `/api/image/depth/${ls.currentRound.name}/${ls.currentSnap.name}/${ls.currentMark.name}/front`
      const backURL = `/api/image/depth/${ls.currentRound.name}/${ls.currentSnap.name}/${ls.currentMark.name}/back`
      const frontP = this.$axios.post(frontURL, { data: { mark: currentMark } })
      const backP = this.$axios.post(backURL, { data: { mark: currentMark } })
      const [f, b] = await Promise.all([frontP, backP])
      const [front, back] = [f.data, b.data]
      const depth = this.initImg({ front, back })
      front.url = frontURL
      back.url = backURL
      this.depth = depth

      // Draw
      const promises = []
      promises.push(this.drawnFacilities(currentMark, depth))
      promises.push(this.drawFacilities(state.selected, currentMark, imgRef.selectedLayer))
      await Promise.all(promises)

      updateImg(imgRef.selectedLayer)
      this.$store.commit('setDepthLoading', false)
      this.setDepthOpacity(this.depth.opacity)
      this.setLayerOpacity(this.layer.opacity)
    }
  }
}
</script>

<style></style>
