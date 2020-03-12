<template>
  <div>
    <h2>Map</h2>
    <ul>
      <li v-for="(article, index) in articles" :key="index">
        <span>{{ article }}</span>
      </li>
    </ul>
    <h2>Comments <small>(nested under articles)</small></h2>
    <ul>
      <div id="map" class="map"></div>
      <li v-for="(comment, index) in comments" :key="index">
        <span>{{ comment }}</span>
      </li>
    </ul>
    <NuxtLink to="/">
      Home
    </NuxtLink>
  </div>
</template>

<script>
import Map from 'ol/Map'
import View from 'ol/View'
import { mapGetters } from 'vuex'
import { Tile, Vector as VectorLayer } from 'ol/layer'
import { ImageWMS, TileWMS, XYZ, Vector } from 'ol/source'
import { Circle, Fill, Style } from 'ol/style'
import { fromLonLat } from 'ol/proj'
import { defaults } from 'ol/control'

const START_ZOOM = 12
const DRAW_LAYER_ID = 12
const START_POINT = [126.972, 37.5293]
const BLUE = '#35C',
  RED = '#F05',
  GREEN = '#2b2',
  WHITE = '#FFF',
  ALPHA = [30, 50, 130, 0.2]
const PINK = '#F19',
  PURPLE = '#97f',
  BLACK = '#000',
  YELLOW = '#fc3'
const DFT_RADIUS = 5,
  ZINDEX_OL = 10
const ZINDEX_REL = ZINDEX_OL + 1,
  ZINDEX_PVR = ZINDEX_OL + 2,
  ZINDEX_SEL = ZINDEX_OL + 3
const DELTA = 0.01
const WORKSPACE = 'stx_sriver_2019_1'
const PVR_LAYER = WORKSPACE + ':stpano-nodes'
const REL_LAYER = WORKSPACE + ':stpano-relation'
const GEOSERVER = 'http://stryx.iptime.org:7545/geoserver/'
const PVR_URL =
  `${GEOSERVER}${WORKSPACE}/ows?service=WFS&version=1.0.0` +
  `&request=GetFeature&typeName=${PVR_LAYER}&outputFormat=application%2Fjson&`

export default {
  computed: mapGetters({
    articles: 'articles/get',
    comments: 'articles/comments/get'
  }),
  mounted() {
    this.init()
  },
  methods: {
    init() {
      /**
       * @summary - Make OSM
       */

      // Using Layers
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
      let map = this.makeOL(layers)
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

    makeOL(layers) {
      /**
       * @summary - Make OpenLayers Main Map
       */
      let center = fromLonLat(START_POINT)
      let view = { projection: 'EPSG:3857', center: center, zoom: START_ZOOM }
      let mapOpt = {
        target: 'ol',
        layers: layers,
        view: new View(view),
        controls: defaults({
          attribution: false,
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
  },

  data: function() {
    return {}
  }
}
</script>

<style></style>
