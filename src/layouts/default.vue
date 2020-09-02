<template>
  <v-app dark>
    <!-- 1. Right Drawer -->
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      temporary
      fixed
      app
    >
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          @click="
            item.title === 'Logout'
              ? $store.commit('localStorage/logout')
              : undefined
          "
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- 2. Upper Bar -->
    <v-app-bar :clipped-left="clipped" fixed app dense>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title v-text="title" />
      <v-spacer /><v-spacer /><v-spacer /><v-spacer /><v-spacer />
      <v-select
        class="mt-6"
        :items="projectsView"
        label="Select Project"
        solo
        v-model="prjView"
        item-text="name"
        return-object
        dense
        @change="changeProject($event.toLowerCase())"
      ></v-select>
    </v-app-bar>

    <!-- 3. Main Contents -->
    <v-main>
      <nuxt />
    </v-main>
  </v-app>
</template>

<script>
export default {
  computed: {
    projectsView() {
      const projects = this.$store.state.localStorage?.user?.projects ?? []
      return projects.map(item => item.name.toUpperCase())
    },
    prjView: {
      get() {
        const prj = this.$store.state.localStorage?.prj ?? ''
        return prj.toUpperCase()
      },
      set() {}
    }
  },
  data() {
    return {
      title: 'MMS TOWER',
      coor: 'Stryx',
      clipped: true,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: 'fas fa-map',
          title: 'Map',
          to: '/map'
        },
        {
          icon: 'fas fa-table',
          title: 'Table',
          to: '/table'
        },
        {
          icon: 'fas fa-meh',
          title: 'Points',
          to: '/cloud'
        },
        {
          icon: 'fas fa-user',
          title: 'Logout',
          to: '/'
        }
      ],
      miniVariant: false
    }
  }
}
</script>
