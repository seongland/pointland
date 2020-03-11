<template>
  <div>
    <h2>poi</h2>
    <ul>
      <li v-for="(todo, index) in poi" :key="index">
        <input :checked="todo.done" type="checkbox" @change="toggle(todo)">
        <span :class="{ done: todo.done }">
          {{ todo.text }}
        </span>
      </li>
      <li><input placeholder="What needs to be done?" @keyup.enter="addTodo"></li>
    </ul>
    <NuxtLink to="/">
      Home
    </NuxtLink>
    <hr class="my-3">
  </div>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex'

export default {
  computed: mapGetters({
    poi: 'poi/poi'
  }),
  methods: {
    addTodo (e) {
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

<style>
.done {
  text-decoration: line-through;
}
</style>
