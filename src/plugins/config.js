import Vue from 'vue'

export default ({ $axios }) => {
  if (process.client) {
    const origin = window.location.origin
    $axios.defaults.baseURL = origin
  }

  Vue.mixin({
    data: () => ({
      title: '3D MAPPING',
      coor: 'Stryx',
      meta: { version: undefined },
      map: undefined,
      tabs: [
        { name: 'Map', type: 'map', show: true },
        { name: 'Image', type: 'image' },
        { name: 'Cloud', type: 'cloud' }
      ],
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
            { name: 'tiffLayer', key: 'tiff', zindex: 11 },
            { name: 'draftLayer', key: 'draft', zindex: 12 },
            { name: 'missionLayer', key: 'mission', zindex: 13 },
            { name: 'recordedLayer', key: 'recorded', zindex: 14 },
            { name: 'processedLayer', key: 'processed', zindex: 15 }
          ],
          vector: [
            {
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
            { name: 'drawLayer', zindex: 24 },
            {
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
        }
      },
      cloudOpt: {}
    })
  })
}
