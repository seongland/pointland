<template>
  <v-app dark>
    <!-- 1. Right Drawer -->
    <v-navigation-drawer v-model="drawer"
      :mini-variant="miniVariant" :clipped="clipped" temporary fixed app>
      <v-list>
        <v-list-item v-for="(item, i) in items"
          :key="i" :to="item.to" router exact>
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title"/>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- 2. Upper Bar -->
    <v-app-bar :clipped-left="clipped" fixed app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"/>

      
      <v-spacer/><v-spacer/><v-spacer/><v-spacer/><v-spacer/>
      <v-container>
        <v-toolbar-title v-text="title" />
      </v-container>
      <v-spacer/><v-spacer/>

    </v-app-bar>

    <!-- 3. Main Contents -->
    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>

    <!-- 4. Footer -->
    <v-footer :fixed="fixed" app>
      <v-spacer/>
      <span>&copy; {{coor}} {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data () {
    return {
      coor : "Stryx",
      clipped: true,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: 'Geo',
          title: 'Main Page',
          to: '/'
        },
        {
          icon: 'ETC',
          title: 'Sub Page',
          to: '/inspire'
        }
      ],
      miniVariant: false,
      title: 'Geo Pano'
    }
  }
}
</script>
