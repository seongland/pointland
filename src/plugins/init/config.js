import Vue from 'vue'
import A from '~/assets/classes/morai/A'
import B from '~/assets/classes/morai/B'
import C from '~/assets/classes/morai/C'
import D from '~/assets/classes/morai/D'

const groups = [A, B, C, D]

export default ({ $axios }) => {
  if (process.client) {
    const origin = window.location.origin
    $axios.defaults.baseURL = origin
  }

  Vue.mixin({
    data: () => ({
      groups,
      title: process.env.title,
      coor: 'Stryx',
      meta: { version: undefined },
      map: undefined,
      tabs: [
        { name: 'Map', type: 'map', show: true },
        { name: 'Image', type: 'image' },
        { name: 'Cloud', type: 'cloud' }
      ],
      idSep: '_',
      mapOpt: {
        id: 'ol',
        zoom: 19,
        zindex: 10,
        center: {
          latlng: [37.5, 126.9],
          lnglat: [126.9, 37.5]
        },
        type: 'satellite',
        layers: {
          geoserver: [
            { callback: { click: null }, name: 'tiffLayer', key: 'tiff', zindex: 11 },
            { callback: { click: null }, name: 'draftLayer', key: 'draft', zindex: 12 },
            { callback: { click: null }, name: 'missionLayer', key: 'mission', zindex: 13 },
            { callback: { click: null }, name: 'recordedLayer', key: 'recorded', zindex: 14 },
            { callback: { click: null }, name: 'processedLayer', key: 'processed', zindex: 15 }
          ],
          vector: [
            {
              callback: { click: null },
              name: 'markLayer',
              zindex: 21,
              style: {
                point: {
                  color: '#22dd88',
                  radius: 5
                }
              }
            },
            {
              callback: { click: null },
              name: 'currentLayer',
              type: 'Point',
              zindex: 22,
              style: {
                point: {
                  color: '#18f',
                  radius: 6
                }
              }
            },
            {
              callback: { click: null },
              name: 'refLayer',
              zindex: 23,
              style: {
                point: {
                  color: '#118080',
                  radius: 2
                },
                line: {
                  color: '#229090',
                  width: 1
                },
                polygon: {
                  fill: '#22909099'
                }
              }
            },
            {
              callback: { click: null },
              name: 'drawnLayer',
              zindex: 24,
              style: {
                point: {
                  color: '#9911ff',
                  radius: 2
                },
                line: {
                  color: '#aa66ff',
                  width: 1
                },
                polygon: {
                  fill: '#aa66ff99'
                }
              }
            },
            {
              callback: { click: null },
              name: 'relatedLayer',
              zindex: 25,
              style: {
                point: {
                  color: '#ff5757',
                  radius: 2
                },
                line: {
                  color: '#f07a7a',
                  width: 1
                },
                polygon: {
                  fill: '#f07a7a99'
                }
              }
            },
            { callback: { click: null }, name: 'drawLayer', zindex: 26 },
            {
              callback: { click: null },
              name: 'selectedLayer',
              zindex: 27,
              style: {
                point: {
                  color: '#990000',
                  radius: 3
                }
              }
            }
          ]
        },
        callback: {
          moveend: null
        }
      },
      cloudOpt: {
        pointLayers: [
          {
            name: 'markLayer',
            color: 0x22dd88,
            size: 0.5,
            length: 10000,
            order: 1,
            callback: { click: null }
          },
          { name: 'currentLayer', color: 0x1188ff, size: 1, length: 1, order: 2, callback: { click: null, filter: null } },

          {
            name: 'refLayer',
            color: 0x118080,
            line: {
              color: 0x229090,
              width: 0.01
            },
            size: 0.2,
            length: 10000,
            order: 3,
            callback: { click: null }
          },
          {
            name: 'drawnLayer',
            color: 0x9911ff,
            line: {
              color: 0xaa66ff,
              width: 0.01
            },
            size: 0.2,
            length: 10000,
            order: 4,
            callback: { click: null }
          },
          {
            name: 'relatedLayer',
            color: 0xff5757,
            line: {
              color: 0xf07a7a,
              width: 0.02
            },
            size: 0.2,
            length: 10000,
            order: 5,
            callback: { click: null }
          },
          {
            name: 'selectedLayer',
            color: 0x990000,
            size: 0.3,
            length: 10000,
            order: 6,
            callback: { click: null, filter: null }
          }
        ]
      }
    })
  })
}
