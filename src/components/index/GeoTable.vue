<template>
  <div>
    <h2>POI</h2>
    <ul>
      <li v-for="(poi, index) in poi" :key="index">
        <input :checked="poi.done" type="checkbox" @change="toggle(poi)" />
        <span :class="{ done: poi.done }">
          {{ poi.text }}
        </span>
      </li>
      <li><input placeholder="ADD" @keyup.enter="addpoi" /></li>
    </ul>
    <NuxtLink to="/">
      Home
    </NuxtLink>
    <hr class="my-3" />
  </div>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex'

export default {
  computed: mapGetters({
    poi: 'poi/poi'
  }),
  methods: {
    addpoi(e) {
      const text = e.target.value
      if (text.trim()) {
        this.$store.commit('poi/add', { text })
      }
      e.target.value = ''
    },
    ...mapMutations({
      toggle: 'poi/toggle'
    })
  }
}
</script>

<style></style>
