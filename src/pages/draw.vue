<template>
  <div>
    <v-tabs v-model="index">
      <v-subheader v-text="title + ' ' + meta.version" />
      <v-spacer />
      <v-tab v-for="tab in tabs" :key="tab.name"> {{ tab.name }} </v-tab>
      <v-spacer />
      <v-select
        class="mt-1 mr-2 rounds"
        label="Round"
        solo
        :items="rounds"
        item-text="name"
        v-model="currentRound.name"
        return-object
        dense
      ></v-select>
      <v-select
        class="mt-1 mr-4 snaps"
        label="Snap"
        solo
        :items="currentRound.snaps"
        item-text="name"
        v-model="currentSnap.name"
        return-object
        dense
      ></v-select>
    </v-tabs>
    <v-tabs-items v-model="index">
      <v-tab-item v-for="(tab, i) in tabs" :key="i">
        <geo-map/>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
import GeoMap from '~/components/index/GeoMap.vue'

export default {
  middleware: 'authentication',
  components: {
    GeoMap
  },
  data: () => ({
    title: '3D MAPPING',
    coor: 'Stryx',
    index: 0,
    meta: {
      version: undefined
    },
    tabs: [
      {
        name: '3D',
        type: '3d'
      },
      {
        name: 'Image',
        type: 'image'
      },
      {
        name: 'Map',
        type: 'map'
      }
    ],
    currentRound: {
      name: 'imms_20200824_193802',
      snaps: [
        {
          name: 'snap1'
        },
        {
          name: 'snap2'
        },
        {
          name: 'snap3'
        }
      ]
    },
    currentSnap: {
      name: 'snap3'
    },
    rounds: [
      {
        name: 'imms_20200824_193802',
        snaps: [
          {
            name: 'snap1'
          },
          {
            name: 'snap2'
          },
          {
            name: 'snap3'
          }
        ]
      },
      {
        name: 'imms_20200825_170217',
        snaps: [
          {
            name: 'snap1'
          },
          {
            name: 'snap2'
          },
          {
            name: 'snap3'
          }
        ]
      }
    ]
  }),
  async mounted() {
    this.meta.version = process.env.version
    const localStorage = this.$store.state.localStorage
    const accessToken = localStorage.accessToken
    const config = { headers: { Authorization: accessToken } }
    const res = await this.$axios.get(
      `/api/user?id=${localStorage.user.id}`,
      config
    )
    const user = res?.data[0]
    await this.loadProjects(user, accessToken)
    this.$store.commit('localStorage/login', { accessToken, user })
  }
}
</script>

<style>
.v-select.rounds {
  width: 300px !important;
}
.v-select.snaps {
  width: 150px !important;
}
</style>
