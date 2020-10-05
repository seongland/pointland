<template>
  <div>
    <v-img :src="src.front">
      <v-img :src="depth ? depth.front : src.front"
    /></v-img>
    <v-img :src="src.back">
      <v-img :src="depth ? depth.back : src.back"
    /></v-img>
  </div>
</template>

<script>
export default {
  computed: {
    src() {
      const ls = this.$store.state.ls
      console.log(ls.currentRound)
      const root = `/api/image/${ls.currentRound.name}/${ls.currentSnap.name}/${ls.currentSeq}`
      return { front: `${root}/front`, back: `${root}/back` }
    }
  },
  asyncComputed: {
    async depth() {
      const frontP = this.$axios.get(`${this.src.front}/depth`)
      const backP = this.$axios.get(`${this.src.back}/depth`)
      const [f, b] = await Promise.all([frontP, backP])
      const [front, back] = [f.data, b.data]
      return { front, back }
    }
  },
  mounted() {},
  methods: {}
}
</script>

<style></style>
