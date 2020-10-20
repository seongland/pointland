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
            <transition name="fade" appear>
              <v-img id="front" v-show="show" :src="depth ? depth.front.uri : src.front.uri" @click="imageClick">
                <v-img :src="depth ? depth.front.layer.selected.uri : src.front.uri"
              /></v-img>
            </transition>
          </v-img>
        </transition>
      </v-col>
      <v-col cols="6" md="6" sm="6" class="py-0 px-0">
        <transition name="fade" appear>
          <v-img :src="src.back.uri" v-show="!loading">
            <transition name="fade" appear>
              <v-img id="back" v-show="show" :src="depth ? depth.back.uri : src.back.uri" @click="imageClick" :opacity="0.7">
                <v-img :src="depth ? depth.back.layer.selected.uri : src.back.uri" />
              </v-img>
            </transition>
          </v-img>
        </transition>
      </v-col>
    </v-row>
    <v-spacer />
    <v-row> </v-row>
  </div>
</template>

<script>
import jimp from 'jimp/browser/lib/jimp'

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
          front: { uri: undefined, layer: { selected: { uri: undefined } } },
          back: { uri: undefined, layer: { selected: { uri: undefined } } }
        }
      const frontURL = `${this.src.front.uri}/depth`
      const backURL = `${this.src.back.uri}/depth`
      const frontP = this.$axios.post(frontURL, { data: { mark: currentMark } })
      const backP = this.$axios.post(backURL, { data: { mark: currentMark } })
      const [f, b] = await Promise.all([frontP, backP])
      const [front, back] = [f.data, b.data]
      jimp.read(Buffer.from(front.uri.split(',')[1], 'base64')).then(image => {
        front.image = image
      })
      jimp.read(Buffer.from(back.uri.split(',')[1], 'base64')).then(image => {
        back.image = image
      })
      front.layer = { selected: { uri: undefined } }
      back.layer = { selected: { uri: undefined } }
      front.layer.selected.image = new jimp(front.width, front.height)
      back.layer.selected.image = new jimp(back.width, back.height)
      front.url = frontURL
      back.url = backURL
      front.name = 'front'
      back.name = 'back'
      this.$store.commit('setDepthLoading', false)
      return { front, back }
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
