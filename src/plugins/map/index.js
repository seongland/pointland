import Vue from 'vue'
import Map from 'ol/Map'
import View from 'ol/View'
import { Tile, Vector as VectorLayer } from 'ol/layer'
import { ImageWMS, TileWMS, XYZ, Vector } from 'ol/source'
import { Circle, Fill, Style } from 'ol/style'
import { fromLonLat, transform } from 'ol/proj'
import { defaults as controls } from 'ol/control'

import 'ol/ol.css'

const START_ZOOM = 12
const DRAW_LAYER_ID = 12
const START_POINT = [126.972, 37.5293]
const RED = '#F05', ALPHA = [30, 50, 130, 0.2]
const DFT_RADIUS = 5, ZINDEX_OL = 10
const ZINDEX_REL = ZINDEX_OL + 1, ZINDEX_PVR = ZINDEX_OL + 2, ZINDEX_SEL = ZINDEX_OL + 3
const DELTA = 0.01
const WORKSPACE = 'stx_sriver_2019_1'
const PVR_LAYER = WORKSPACE + ':stpano-nodes'
const REL_LAYER = WORKSPACE + ':stpano-relation'
const GEOSERVER = 'http://stryx.iptime.org:7545/geoserver/'
const PVR_URL =
  `${GEOSERVER}${WORKSPACE}/ows?service=WFS&version=1.0.0` +
  `&request=GetFeature&typeName=${PVR_LAYER}&outputFormat=application%2Fjson&`

  
Vue.mixin({
  methods: {
    olInit() {
      /**
       * @summary - Make OSM
       */
      let styles = this.makeStyle()
      let pvrLayer = this.makePvrLayer()
      let relLayer = this.makeRelLayer()
      let googleLayer = this.makeGoogleLayer()
      let drawLayer = this.makeDrawLayer(styles)

      // Other Layers
      // let osmLayer = makeOSMLayer()
      // let mbLayer = makeMBLayer()
      // let gsLayer = makeGSLayer()

      let layers = [googleLayer, pvrLayer, relLayer, drawLayer]
      let map = this.makeOLMap(layers)
      drawLayer.map = map
      // this.eventBind(map)
      return map
    },

    makeDrawLayer(styles) {
      /**
       * @summary - Make Draw Map
       */
      let tempArray = []
      let vectorSrc = new Vector({ features: tempArray })
      let drawLayer = new VectorLayer({
        source: vectorSrc,
        style: styles.circleRed
      })
      drawLayer.styles = styles
      drawLayer.setZIndex(ZINDEX_PVR)
      drawLayer.setProperties({ lid: DRAW_LAYER_ID })
      return drawLayer
    },

    makeStyle() {
      /**
       * @summary - Make Diverse Style
       * @function
       */
      let styles = {}
      styles.prop = {
        fRed: new Fill({ color: RED }),
        fAlpha: new Fill({ color: ALPHA })
      }
      let cricleDft = { radius: DFT_RADIUS }
      let ciRedI = new Circle({ ...cricleDft, fill: styles.prop.fRed })
      let ciAlphaI = new Circle({
        radius: DFT_RADIUS * 10,
        fill: styles.prop.fAlpha
      })
      styles = {
        ...styles,
        circleRed: new Style({ image: ciRedI }),
        circleAlpha: new Style({ image: ciAlphaI })
      }
      styles.circleRed.setZIndex(ZINDEX_SEL)
      return styles
    },

    makeOLMap(layers) {
      /**
       * @summary - Make OpenLayers Main Map
       */
      let center = fromLonLat(START_POINT)
      let view = { projection: 'EPSG:3857', center: center, zoom: START_ZOOM }
      let mapOpt = {
        target: 'map',
        layers: layers,
        view: new View(view),
        controls: controls({
          zoom: false,
          rotate: false
        })
      }
      return new Map(mapOpt)
    },

    makePvrLayer() {
      /**
       * @summary - Get Marker Image Layer
       */
      let pvrLayer = new Tile({
        source: new TileWMS({
          url: `${GEOSERVER}${WORKSPACE}/wms`,
          params: { LAYERS: PVR_LAYER },
          ratio: 1,
          serverType: 'geoserver'
        })
      })
      pvrLayer.setZIndex(ZINDEX_PVR)
      return pvrLayer
    },

    makeRelLayer() {
      /**
       * @summary - Get Marker Image Layer
       */
      return new Tile({
        source: new TileWMS({
          url: `${GEOSERVER}${WORKSPACE}/wms`,
          params: { LAYERS: REL_LAYER },
          ratio: 1,
          serverType: 'geoserver',
          crossOrigin: 'anonymous'
        })
      })
    },

    eventBind(map) {
      /**
       * @summary - OL Event Bind
       */
      map.on('click', mapClick)
    },

    mapClick(e) {
      /**
       * @summary - When Click Map
       */
      let coor = transform(e.coordinate, 'EPSG:3857', 'EPSG:4326')
      let extent = e.map.getView().calculateExtent()
      let leftBottom = transform(extent.slice(0, 2), 'EPSG:3857', 'EPSG:4326')
      let rightTop = transform(extent.slice(2, 4), 'EPSG:3857', 'EPSG:4326')
      let size = rightTop.map((e, i) => {
        return e - leftBottom[i]
      })
      let drawLayer = getDrawLayer(e.map)
      console.log(coor, size)
    },

    getDrawLayer(map) {
      for (layer of map.getLayers().getArray())
        if (layer.get('lid') === DRAW_LAYER_ID) return layer
    },

    makeGoogleLayer() {
      /**
       * @summary - Make Google Road Map
       */
      let tile = {
        source: new XYZ({
          url: `https://mt1.google.com/vt/lyrs=m@113&hl=en&&x={x}&y={y}&z={z}`
        })
      }
      return new Tile(tile)
    }
  }
})
