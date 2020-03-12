import Vue from 'vue'
import Map from 'ol/Map'
import View from 'ol/View'
import { Tile, Vector as VectorLayer } from 'ol/layer'
import { TileWMS, XYZ, Vector } from 'ol/source'
import { Circle, Fill, Style } from 'ol/style'
import { fromLonLat, transform } from 'ol/proj'
import { defaults as controls } from 'ol/control'
import { Feature } from 'ol'
import { Point } from 'ol/geom'
import { GeoJSON } from 'ol/format'
import { makeArcStyle } from '~/plugins/map/draw.js'
import { ZINDEX_SEL,  START_ZOOM, ZINDEX_PVR, DFT_RADIUS } from '~/plugins/map/const.js'


import 'ol/ol.css'

const DRAW_LAYER_ID = 12
const START_POINT = [126.972, 37.5293]
const RED = '#F05', ALPHA = [30, 50, 130, 0.2]
const DELTA = 0.01
const WORKSPACE = 'stx_sriver_2019_1'
const PVR_LAYER = WORKSPACE + ':stpano-nodes'
const REL_LAYER = WORKSPACE + ':stpano-relation'
const GEOSERVER = 'http://stryx.iptime.org:7545/geoserver/'
const PVR_URL =
  `${GEOSERVER}${WORKSPACE}/ows?service=WFS&version=1.0.0` +
  `&request=GetFeature&typeName=${PVR_LAYER}&outputFormat=application%2Fjson&`
const ARC_FID = 100
const π = Math.PI
const ATAN = Math.atan

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
      let map = this.makeOlMap(layers)
      drawLayer.map = map
      this.eventBind(map)
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

    makeOlMap(layers) {
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
      map.on('click', this.mapClick)
    },

    mapClick(e) {
      /**
      * @summary - When Click Map
      */
      let coor = transform(e.coordinate, 'EPSG:3857', 'EPSG:4326')
      let extent = e.map.getView().calculateExtent()
      let leftBottom = transform(extent.slice(0, 2), 'EPSG:3857', 'EPSG:4326')
      let rightTop = transform(extent.slice(2, 4), 'EPSG:3857', 'EPSG:4326')
      let size = rightTop.map((e, i) => { return e - leftBottom[i] })
      let drawLayer = this.getDrawLayer(e.map)
      this.getNears(coor, size, drawLayer)
    },

    getDrawLayer(map) {
      for (let layer of map.getLayers().getArray())
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
    },

    getNears(coor, size, drawLayer) {
      /**
      * @summary - Get Near Features & Get nearest feature
      */
      fetch(
        PVR_URL + this.roundFilter(coor, size),
        { method: 'GET', mode: 'cors' }
      )
        .then(response => {
          return response.json()
        })
        .then(json => {
          let features = new GeoJSON().readFeatures(json)

          // Else Move Pano
          if (features.length === 0) return this.panoMovebyMap(coor, drawLayer)
          let feature = this.getNearest(features, coor)
          this.drawSelect(feature, drawLayer)
          // stpano.AvatarMove({
          //   nodeid: feature.get('pvrid')
          // })
        })
    },


    changeFeaturebyID(pvrid, map) {
      let drawLayer = this.getDrawLayer(map)
      fetch(
        PVR_URL + pvrIdFilter(pvrid),
        { method: 'GET', mode: 'cors' }
      )
        .then(response => {
          return response.json()
        })
        .then(json => {
          let features = new GeoJSON().readFeatures(json)
          if (features.length === 0) return alert("No Feature In Geoserver")
          let feature = features[0]
          this.drawSelect(feature, drawLayer)
          stpano.AvatarMove({
            nodeid: pvrid
          })
        })
    },


    panoMovebyMap(coor, drawLayer) {
      let arc = this.getArc(drawLayer)
      if (!arc) return
      arcPoint = arc.get('geometry').flatCoordinates
      arcCoor = transform(arcPoint, 'EPSG:3857', 'EPSG:4326')
      let angle = cptMapAngle(...arcCoor, ...coor)
      this.changeArc(angle, 90, drawLayer.map)
      let heading = 360 - drawLayer.selected.get('heading')
      console.log('angle', angle)
      angle = angle - heading
      console.log(angle, heading)
      // stpano.SetHorizontalLookAngle(angle)
    },


    squareFilter(coor, size) {
      /**
      * @summary - Squrare Shaped lat lon squaure CQL filter
      */
      return `CQL_FILTER=${coor[0] - DELTA * size[1]}<lon and lon<${coor[0] + DELTA * size[1]}` +
        `and lat<${coor[1] + DELTA * size[1]} and ${coor[1] - DELTA * size[1]}<lat`
    },


    roundFilter(coor, size) {
      /**
      * @summary - Round Shaped D-WITHIN CQL filter
      */
      return `CQL_FILTER=DWITHIN(geom,POINT(${coor[0]} ${coor[1]}),${size[0] + size[1]},kilometers)`
    },


    pvrIdFilter(pvrid) {
      /**
      * @summary - PvrID CQL filter
      */
      return `CQL_FILTER=pvrid=${pvrid}`
    },


    getNearest(features, coor) {
      /**
      * @summary - Get nearest feature
      */
      let vectorSource = new Vector({
        format: new GeoJSON()
      })
      vectorSource.addFeatures(features)
      return vectorSource.getClosestFeatureToCoordinate(coor)
    },

    getArc(drawLayer) { return drawLayer.get('source').getFeatureById(ARC_FID) },


    drawSelect(feature, drawLayer) {
      let lonlat = [feature.get('lon'), feature.get('lat')]
      let loc = fromLonLat(lonlat)
      let coor = new Point(loc)
      let heading = -feature.get('heading')
      drawLayer.selected = feature
      feature = new Feature({ geometry: coor })
      drawLayer.getSource().clear()
      drawLayer.getSource().addFeature(feature)
      this.drawCompass(heading, coor, drawLayer)
    },


    drawCompass(heading, coor, drawLayer) {
      /**
       * @summary - Make Panorama Rotating Compass
       */

      // round Area
      let feature = new Feature({ geometry: coor })
      feature.setStyle(drawLayer.styles.circleAlpha)
      drawLayer.getSource().addFeature(feature)

      // Compass
      let fov = 90
      let arcStyle = makeArcStyle(heading, fov)
      feature = new Feature({ geometry: coor })
      feature.setStyle(arcStyle)
      feature.setId(ARC_FID)
      drawLayer.getSource().addFeature(feature)
    },


    changeArc(heading, fov, map) {
      heading = heading % 360
      let drawLayer = this.getDrawLayer(map)
      let arc = this.getArc(drawLayer)
      let arcStyle = makeArcStyle(heading, fov)
      arc.setStyle(arcStyle)
    },

    cptMapAngle: (x_m, y_m, x_w, y_w) => {
      /**
       * Compute angle from +y axis of map by counter-clockwise
       * @todo - TM scope
       */
      let z = (x_m - x_w) / (y_m - y_w)
      let angle = (π / 2 - ATAN(z)) * (180 / π)
      if (y_m - y_w > 0) return 270 - angle
      else return (450 - angle) % 360
    }

  }
})
