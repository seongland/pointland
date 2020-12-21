### Config
```json
{
  pointLayers: [
    {
      name: 'markLayer',
      color: 0x22dd88,
      size: 0.5,
      length: 10000,
      order: 1,
      callback: { click: null }
    },
    { name: 'currentLayer', color: 0x1188ff, size: 1, length: 1, order: callback: { click: null, filter: null } 
    {
      name: 'refLayer',
      color: 0x118080,
      line: {
        color: 0x229090,
        width: 0.01
      },
      size: 0.15,
      length: 10000,
      order: 3,
      callback: { click: null }
    },
    {
      name: 'drawnLayer',
      color: 0x9003fc,
      line: {
        color: 0xa013ff,
        width: 0.02
      },
      size: 0.3,
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
      size: 0.4,
      length: 10000,
      order: 6,
      callback: { click: null, filter: null }
    }
  ]
}
```
