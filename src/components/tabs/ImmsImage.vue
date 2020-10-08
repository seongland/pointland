<template>
  <div>
    <transition name="fade" appear>
      <v-img :src="src.front.uri" v-if="!loading">
        <transition name="fade" appear>
          <v-img id="front" v-if="show" :src="depth ? depth.front.uri : src.front.uri" @click="imageClick" />
        </transition>
      </v-img>
    </transition>
    <transition name="fade" appear>
      <v-img :src="src.back.uri" v-if="!loading">
        <transition name="fade" appear>
          <v-img id="back" v-if="show" :src="depth ? depth.back.uri : src.back.uri" @click="imageClick" />
        </transition>
      </v-img>
    </transition>
  </div>
</template>

<script>
import jimp from 'jimp/browser/lib/jimp'

const NEAR = 5

export default {
  data: () => ({ loading: false, on: true }),
  computed: {
    src() {
      const ls = this.$store.state.ls
      const root = `/api/image/${ls.currentRound.name}/${ls.currentSnap.name}/${ls.currentSeq}`
      return { front: { uri: `${root}/front` }, back: { uri: `${root}/back` } }
    },
    show() {
      return !this.loading && this.on
    }
  },
  asyncComputed: {
    async depth() {
      this.loading = true
      const frontURL = `${this.src.front.uri}/depth`
      const backURL = `${this.src.back.uri}/depth`
      const frontP = this.$axios.get(frontURL)
      const backP = this.$axios.get(backURL)
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
      this.loading = false
      return { front, back }
    }
  },
  mounted() {
    window.removeEventListener('keypress', this.keyEvent)
    window.addEventListener('keypress', this.keyEvent)
  },
  methods: {
    keyEvent(event) {
      const commit = this.$store.commit
      const state = this.$store.state
      const index = this.$store.state.ls.index
      console.log(event)
      switch (event.key) {
        case 'd':
          if (index !== 1) return
          this.on = !this.on
          return
        case ',':
          if (this.loading) return
          commit('ls/setSeq', state.ls.currentSeq - 1)
          this.loading = true
          return
        case '.':
          if (this.loading) return
          commit('ls/setSeq', state.ls.currentSeq + 1)
          this.loading = true
          return
        case '1':
          return commit('ls/setIndex', Number(event.key) - 1)
        case '2':
          return commit('ls/setIndex', Number(event.key) - 1)
        case '3':
          return commit('ls/setIndex', Number(event.key) - 1)
      }
    },

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
      this.$axios.get(`${data.url}/${x}/${y}`).then(res => {
        const latlng = [res.data[0], res.data[1]]
        this.drawXY(latlng, true, latlng[0])
      })
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
