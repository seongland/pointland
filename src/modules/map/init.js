/**
 * @summary - Map Default module
 * @module
 */

import 'ol/ol.css'
import Map from 'ol/Map'
import View from 'ol/View'
import { defaults as controls } from 'ol/control'
import { fromLonLat } from 'ol/proj'
import { defaults, DragPan, MouseWheelZoom, PinchZoom } from 'ol/interaction'
import { makeStyle } from './draw'
import { makeNaverMap, makeTileLayer, makeVectorLayer } from '~/modules/map/layer'
import { eventBind } from '~/modules/map/event'

export const ref = {}

function olInit(opt, geoserver, workspace, layers) {
  /**
   * @summary - Make OSM
   */
  const styles = makeStyle()
  const naver = makeNaverMap(opt)
  const openlayers = []

  for (const vectorConfig of opt.layers.vector) openlayers.push(makeVectorLayer(vectorConfig))

  if (geoserver) {
    for (const config of opt.layers.geoserver)
      if (layers[config.key]) {
        ref[config.name] = makeTileLayer(geoserver, workspace, layers[config.key], config.zindex, config.focus)
        openlayers.push(ref[config.name])
      }
    ref.geoserver = geoserver
    ref.workspace = workspace
    ref.layers = layers
  }

  const map = makeOlMap(opt, openlayers)
  map.styles = styles
  map.naver = naver
  map.opt = opt
  ref.map = map
  eventBind(map, opt)
  return map
}

function makeOlMap(opt, layers) {
  /**
   * @summary - Make OpenLayers Main Map
   */
  let center = fromLonLat(opt.center.lnglat)
  let view = { projection: 'EPSG:3857', center: center, zoom: opt.zoom, enableRotation: false }
  let mapOpt = {
    target: opt.id,
    layers: layers,
    interactions: defaults({ dragPan: false }).extend([
      new DragPan({ kinetic: false }),
      new MouseWheelZoom({ duration: 0 }),
      new PinchZoom({ constrainResolution: true })
    ]),
    view: new View(view),
    controls: controls({ zoom: true })
  }
  return new Map(mapOpt)
}

export { olInit }
