<template>
  <v-navigation-drawer permanent expand-on-hover app color="grey darken-4">
    <v-list>
      <v-list-item class="px-2">
        <v-list-item-avatar>
          <v-img src="/profile.png"></v-img>
        </v-list-item-avatar>
      </v-list-item>
      <v-list-item link>
        <v-list-item-content>
          <v-list-item-subtitle v-text="$store.state.ls.user ? $store.state.ls.user.email : ''" />
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <v-divider></v-divider>

    <v-list nav dense>
      <v-list-item-group v-model="layerIndex" color="primary">
        <div v-for="classObj in groups" :key="classObj.class">
          <v-list-item
            :disabled="disabled"
            link
            v-for="layerObj in classObj.layers"
            :key="layerObj.layer"
            @click="setLayer({ object: layerObj })"
          >
            <v-list-item-icon v-text="layerObj.layer" />
            <v-list-item-title v-text="layerObj.description" />
            <v-list-item-subtitle v-text="layerObj.type" />
          </v-list-item>
          <v-divider></v-divider>
        </div>
      </v-list-item-group>

      <v-list>
        <v-list-item link>
          <v-list-item-content>
            <v-list-item-subtitle v-text="`Help`" @click="$router.push('/help')" />
          </v-list-item-content>
        </v-list-item>
        <v-list-item link>
          <v-list-item-content>
            <v-list-item-subtitle v-text="`Logout`" @click="$store.commit('ls/logout')" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  computed: {
    layerIndex: {
      get() {
        return this.$store.state.ls.targetLayer.index
      },
      set(values) {
        this.setLayer({ index: values })
      }
    },
    disabled() {
      const state = this.$store.state
      if (state.edit.ing || state.submit.ing) return true
      else if (state.loading || state.depth.loading) return true
      else false
    }
  }
}
</script>
