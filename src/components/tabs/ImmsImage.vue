<template>
  <div>
    <v-img :src="src.front.uri">
      <transition name="fade" appear>
        <v-img
          id="front"
          :src="depth ? depth.front.uri : src.front.uri"
          v-if="show"
          @click="click"
        />
      </transition>
    </v-img>
    <v-img :src="src.back.uri">
      <transition name="fade" appear>
        <v-img
          id="back"
          :src="depth ? depth.back.uri : src.back.uri"
          v-if="show"
          @click="click"
        />
      </transition>
    </v-img>
  </div>
</template>

<script>
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
      const frontP = this.$axios.get(`${this.src.front.uri}/depth`)
      const backP = this.$axios.get(`${this.src.back.uri}/depth`)
      const [f, b] = await Promise.all([frontP, backP])
      const [front, back] = [f.data, b.data]
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
          commit('ls/changeSeq', state.ls.currentSeq - 1)
          this.loading = true
          return
        case '.':
          if (this.loading) return
          commit('ls/changeSeq', state.ls.currentSeq + 1)
          this.loading = true
          return
      }
    },
    click(e) {
      let image
      console.log(e.layerX, e.layerY)
      const wrapper = e.target.parentNode
      if (wrapper.id === 'front') image = this.depth.front
      if (wrapper.id === 'back') image = this.depth.back
      console.log(image)
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
