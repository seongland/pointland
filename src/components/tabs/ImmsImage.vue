<template>
  <div style="background: #000">
    <v-row align="center" justify="center">
      <v-col cols="6" md="6" sm="6" class="py-0 px-0">
        <transition name="fade" appear>
          <v-img :src="src.front.uri" v-if="!loading">
            <transition name="fade" appear>
              <v-img id="front" v-if="show" :src="depth ? depth.front.uri : src.front.uri" @click="imageClick">
                <v-img :src="depth ? depth.front.layer.selected.uri : src.front.uri"
              /></v-img>
            </transition>
          </v-img>
        </transition>
      </v-col>
      <v-col cols="6" md="6" sm="6" class="py-0 px-0">
        <transition name="fade" appear>
          <v-img :src="src.back.uri" v-if="!loading">
            <transition name="fade" appear>
              <v-img id="back" v-if="show" :src="depth ? depth.back.uri : src.back.uri" @click="imageClick">
                <v-img :src="depth ? depth.back.layer.selected.uri : src.back.uri" />
              </v-img>
            </transition>
          </v-img>
        </transition>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import jimp from 'jimp/browser/lib/jimp'

export default {
  computed: {
    src() {
      const ls = this.$store.state.ls
      const root = `/api/image/${ls.currentRound.name}/${ls.currentSnap.name}/${ls.currentMark.name}`
      return { front: { uri: `${root}/front` }, back: { uri: `${root}/back` } }
    },
    show() {
      const depth = this.$store.state.depth
      return !depth.loading && depth.on
    },
    loading() {
      return this.$store.state.depth.loading
    }
  },

  asyncComputed: {
    async depth() {
      this.$store.commit('setDepthLoading', true)
      const currentMark = this.$store.state.ls.currentMark
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
      this.$store.commit('setDepthLoading', false)
      return { front, back }
    }
  }
}
</script>

<style>
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-leave-to {
  opacity: 0;
}
</style>
