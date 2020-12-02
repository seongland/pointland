### Config
```json
{
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
            color: '#9003fc',
            radius: 3
          },
          line: {
            color: '#a013ff',
            width: 1
          },
          polygon: {
            fill: '#a013ff99'
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
}
```
