import 'ol/ol.css'
import Map from 'ol/Map'
import View from 'ol/View'
import { defaults as controls } from 'ol/control'
import { fromLonLat } from 'ol/proj'
import {
  makeGoogleLayer,
  makeDraftLayer,
  makeRecordedLayer,
  makeMissionLayer
} from '~/plugins/map/layer'
import { DRAW_LAYER_ID, START_ZOOM, START_POINT } from '~/plugins/map/const'
import { eventBind } from '~/plugins/map/event'

function olInit() {
  /**
   * @summary - Make OSM
   */
  let googleLayer = makeGoogleLayer()
  let draftLayer = makeDraftLayer()
  let recordedLayer = makeRecordedLayer()
  let missionLayer = makeMissionLayer()
  let layers = [googleLayer, draftLayer, recordedLayer, missionLayer]
  let map = makeOlMap(layers)
  eventBind(map)
  return map
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
