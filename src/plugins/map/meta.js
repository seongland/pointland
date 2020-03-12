import Map from 'ol/Map'
import View from 'ol/View'
import { Circle, Fill, Style } from 'ol/style'
import { defaults as controls } from 'ol/control'
import { fromLonLat } from 'ol/proj'

import 'ol/ol.css'

import { makePvrLayer, makeGoogleLayer, makeRelLayer, makeDrawLayer } from '~/plugins/map/layer.js'
import { RED,  ALPHA, DFT_RADIUS, ZINDEX_SEL } from '~/plugins/map/const.js'
import { DRAW_LAYER_ID, START_ZOOM, START_POINT } from '~/plugins/map/const.js'
import { eventBind } from '~/plugins/map/event.js'


function olInit() {
  /**
   * @summary - Make OSM
   */
  let styles = makeStyle()
  let pvrLayer = makePvrLayer()
  let relLayer = makeRelLayer()
  let googleLayer = makeGoogleLayer()
  let drawLayer = makeDrawLayer(styles)

  // Other Layers
  // let osmLayer = makeOSMLayer()
  // let mbLayer = makeMBLayer()
  // let gsLayer = makeGSLayer()

  let layers = [googleLayer, pvrLayer, relLayer, drawLayer]
  let map = makeOlMap(layers)
  drawLayer.map = map
  eventBind(map)
  return map
}


function makeStyle() {
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
}


function makeOlMap(layers) {
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
}


function getDrawLayer(map) {
  for (let layer of map.getLayers().getArray())
    if (layer.get('lid') === DRAW_LAYER_ID) return layer
}


export { olInit, getDrawLayer }
