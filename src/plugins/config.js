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
              type: 'Point',
              zindex: 21,
              style: {
                color: '#22dd88',
                radius: 5
              }
            },
            {
              name: 'currentLayer',
              type: 'Point',
              zindex: 22,
              style: {
                color: '#18f',
                radius: 6
              }
            },
            {
              name: 'drawnLayer',
              type: 'Point',
              zindex: 23,
              style: {
                color: '#9911ff',
                radius: 2
              }
            },
            { name: 'drawLayer', zindex: 24 },
            {
              name: 'selectedLayer',
              type: 'Point',
              zindex: 25,
              style: {
                color: '#FF8C00',
                radius: 2
              }
            }
          ]
        }
      },
      cloudOpt: {}
    })
  })
}
