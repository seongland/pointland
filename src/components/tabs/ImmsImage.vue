<template>
  <div style="background: #000">
    <v-row align="center" justify="center">
      <v-col cols="6" md="6" sm="6" class="py-0 px-0">
        <transition name="fade" appear>
          <v-img :src="src.front.uri" v-if="!loading">
            <transition name="fade" appear>
              <v-img id="front" v-if="show" :src="depth ? depth.front.uri : src.front.uri" @click="imageClick" />
            </transition>
          </v-img> </transition
      ></v-col>
      <v-col cols="6" md="6" sm="6" class="py-0 px-0">
        <transition name="fade" appear>
          <v-img :src="src.back.uri" v-if="!loading">
            <transition name="fade" appear>
              <v-img id="back" v-if="show" :src="depth ? depth.back.uri : src.back.uri" @click="imageClick" />
            </transition>
          </v-img> </transition
      ></v-col>
    </v-row>
  </div>
</template>

<script>
import jimp from 'jimp/browser/lib/jimp'
import { v4 as uuid } from 'uuid'

const NEAR = 5

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
      front.url = frontURL
      back.url = backURL
      this.$store.commit('setDepthLoading', false)
      return { front, back }
    }
  },

  methods: {
    async imageClick(e) {
      let image, data
      const xRatio = e.offsetX / e.target.offsetWidth
      const yRatio = e.offsetY / e.target.offsetHeight
      const wrapper = e.target.parentNode
      if (wrapper.id === 'front') data = this.depth.front
      if (wrapper.id === 'back') data = this.depth.back
      image = data.image
      if (!image) return
      let x = Math.round(image.bitmap.width * xRatio)
      let y = Math.round(image.bitmap.height * yRatio)
      const color = image.getPixelColor(x, y)
      if (color === 0) {
        const point = this.checkNear(image, x, y)
        if (!point) return
        x = point[0]
        y = point[1]
      }
      this.drawNear(image, x, y)
      image.getBase64Async('image/png').then(uri => (data.uri = uri))
      const res = await this.$axios.get(`${data.url}/${x}/${y}`)
      const xyz = res.data
      this.selectXYZ(xyz, uuid())
    },

    checkNear(image, x, y) {
      const nearArray = new Array(NEAR).fill(0).map((v, i) => i + 1)
      let color
      for (const d of nearArray) {
        let square = new Array(2 * d + 1).fill(0).map((v, i) => i - d)
        square = square.sort((a, b) => Math.abs(a) - Math.abs(b))
        for (const axios of square) {
          const points = [
            [x + d, y + axios],
            [x - d, y + axios],
            [x + axios, y + d],
            [x + axios, y - d]
          ]
          for (const point of points) if (image.getPixelColor(...point)) return point
        }
      }
    },

    drawNear(image, x, y) {
      image.setPixelColor(0x44ffddff, x, y)
      image.setPixelColor(0x44ffddff, x - 1, y - 1)
      image.setPixelColor(0x44ffddff, x + 1, y + 1)
      image.setPixelColor(0x44ffddff, x + 1, y - 1)
      image.setPixelColor(0x44ffddff, x - 1, y + 1)
      image.setPixelColor(0x44ffddff, x, y - 1)
      image.setPixelColor(0x44ffddff, x, y + 1)
      image.setPixelColor(0x44ffddff, x + 1, y)
      image.setPixelColor(0x44ffddff, x - 1, y)
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
