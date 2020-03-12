<template>
  <div>
    <p>
      <button @click="$store.commit('increment')">
        {{ $store.state.counter }}</button
      ><br />
      <NuxtLink to="/sub">
        sub
      </NuxtLink>
    </p>
  </div>
</template>
