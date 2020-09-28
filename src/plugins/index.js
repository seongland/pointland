import Vue from 'vue'
import { olInit } from '~/plugins/map/meta'
import { drawXYs, drawXY, subtractVhcl } from "./map/draw"
import { initCloud, purgeCloud } from "./cloud/meta"
import { drawLas } from "./cloud/draw"

export default ({ $axios }) => {
  Vue.mixin({
    data: () => ({
      title: '3D MAPPING',
      coor: 'Stryx',
      index: 0,
      meta: {
        version: undefined
      },
      map: undefined,
      tabs: [
        {
          name: 'Map',
          type: 'map'
        },
        {
          name: 'Image',
          type: 'image'
        },
        {
          name: '3D',
          type: '3d'
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
    methods: {
      initCloud: () => initCloud(),
      purgeCloud: () => purgeCloud(),
      drawLas: (lasJson) => drawLas(lasJson),
      drawXYs: (data, id) => drawXYs(data, id),
      subtractVhcl: (id) => subtractVhcl(id),
      drawXY: (data, focus, id) => drawXY(data, focus, id),

      async loadProjects(user, accessToken) {
        const projectPromises = []
        const config = { headers: { Authorization: accessToken } }
        for (const i in user.projects)
          projectPromises.push(this.$axios.get(
            `/api/projects?id=${user.projects[i].id}`,
            config
          ))
        const projectResponses = await Promise.all(projectPromises)
        user.projects = projectResponses.map(res => res.data[0])
      },

      olInit(geoserver, workspace, layers) {
        this.map = olInit(geoserver, workspace, layers)
        return this.map
      },

      waitAvail(flag, callback, args) {
        this.$nextTick(
          () => flag() ? callback(...args) : this.waitAvail(flag, callback, args)
        )
      }
    }
  })
  if (process.client) {
    const origin = window.location.origin
    $axios.defaults.baseURL = origin
  }
}
