import Vue from 'vue'

export default ({ $axios }) => {
  if (process.client) {
    const origin = window.location.origin
    $axios.defaults.baseURL = origin
  }

  Vue.mixin({
    data: () => ({
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
              name: 'drawnLayer',
              zindex: 23,
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
            { callback: { click: null }, name: 'drawLayer', zindex: 24 },
            {
              callback: { click: null },
              name: 'selectedLayer',
              zindex: 25,
              style: {
                point: {
                  color: '#FF8C00',
                  radius: 2
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
            callback: { click: null, filter: null }
          },
          { name: 'currentLayer', color: 0x1188ff, size: 1, length: 1, order: 2, callback: { click: null, filter: null } },
          {
            name: 'drawnLayer',
            color: 0x9911ff,
            size: 0.2,
            length: 5000,
            order: 3,
            callback: { click: null, filter: null }
          },
          { name: 'selectedLayer', color: 0xff8c00, size: 0.2, length: 1, order: 4, callback: { click: null, filter: null } }
        ]
      }
    })
  })
}
