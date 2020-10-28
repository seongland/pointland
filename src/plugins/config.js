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
        zoom: 20,
        zindex: 10,
        center: {
          latlng: [37.5293, 126.972],
          lnglat: [126.972, 37.5293]
        },
        type: 'satellite',
        layers: {
          geoserver: [
            { name: 'tiffLayer', key: 'tiff', zindex: 11 },
            { name: 'draftLayer', key: 'draft', zindex: 12 },
            { name: 'missionLayer', key: 'mission', zindex: 13 },
            { name: 'recordedLayer', key: 'recorded', zindex: 14 }
          ],
          vector: [
            {
              name: 'markLayer',
              type: 'Point',
              zindex: 21,
              style: {
                color: '#22dd88',
                radius: 2
              }
            },
            {
              name: 'currentLayer',
              type: 'Point',
              zindex: 22,
              style: {
                color: '#18f',
                radius: 5
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
                color: '#ff5599',
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
