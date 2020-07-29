/**
 * @summary - Map Default module
 * @module
 */

import 'ol/ol.css'
import Map from 'ol/Map'
import View from 'ol/View'
import { defaults as controls } from 'ol/control'
import { fromLonLat } from 'ol/proj'
import { defaults, DragPan, MouseWheelZoom } from 'ol/interaction'

import { makeStyle } from './draw'
import {
  makeDraftLayer,
  makeRecordedLayer,
  makeMissionLayer,
  makeNaverMap,
  makeCurrentLayer,
  makeRecordingLayer
} from '~/plugins/map/layer'
import { DRAW_LAYER_ID, INIT_ZOOM, START_POINT, MAP_ID } from '~/plugins/map/const'
import { eventBind } from '~/plugins/map/event'

export const ref = {}

function olInit() {
  /**
   * @summary - Make OSM
   */
  const styles = makeStyle()
  const naver = makeNaverMap()
  const draftLayer = makeDraftLayer()
  const missionLayer = makeMissionLayer()
  const recordedLayer = makeRecordedLayer()
  const recordingLayer = makeRecordingLayer(styles)
  const currentLayer = makeCurrentLayer(styles)
  const layers = [recordingLayer, currentLayer, draftLayer, recordedLayer, missionLayer]
  const map = makeOlMap(layers)
  map.styles = styles
  map.naver = naver
  ref.map = map
  ref.recordingLayer = recordingLayer
  ref.currentLayer = currentLayer
  eventBind(map)
  return map
}

function makeOlMap(layers) {
  /**
   * @summary - Make OpenLayers Main Map
   */
  let center = fromLonLat(START_POINT)
  let view = { projection: 'EPSG:3857', center: center, zoom: INIT_ZOOM, enableRotation: false }
  let mapOpt = {
    target: MAP_ID,
    layers: layers,
    interactions: defaults({
      dragPan: false
    }).extend([new DragPan({
      kinetic: false,
    }), new MouseWheelZoom({ duration: 0 })]),

    view: new View(view),
    controls: controls({
      zoom: true
    })
  }
  return new Map(mapOpt)
}

function getDrawLayer(map) {
  for (let layer of map.getLayers().getArray())
    if (layer.get('lid') === DRAW_LAYER_ID) return layer
}

export { olInit, getDrawLayer }
