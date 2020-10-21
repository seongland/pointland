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
import { ZINDEX_PVR } from '~/plugins/map/config'
import { makeStyle } from './draw'
import { makeNaverMap, makeTileLayer, makeVectorLayer } from '~/plugins/map/layer'
import { INIT_ZOOM, START_POINT, MAP_ID } from '~/plugins/map/config'
import { eventBind } from '~/plugins/map/event'

export const ref = {}
const layerConfig = {
  geoserverLayers: [{ name: 'tiffLayer', key: 'tiff' }],
  vectorLayers: [
    {
      name: 'markLayer',
      type: 'Point',
      zindex: ZINDEX_PVR + 1,
      style: {
        color: '#22dd88',
        radius: 2
      }
    },
    {
      name: 'currentLayer',
      type: 'Point',
      zindex: ZINDEX_PVR + 2,
      style: {
        color: '#18f',
        radius: 5
      }
    },
    {
      name: 'drawnLayer',
      type: 'Point',
      zindex: ZINDEX_PVR + 3,
      style: {
        color: '#9911ff',
        radius: 2
      }
    },
    { name: 'drawLayer', zindex: ZINDEX_PVR + 4 },
    {
      name: 'selectedLayer',
      type: 'Point',
      zindex: ZINDEX_PVR + 5,
      style: {
        color: '#ff5599',
        radius: 2
      }
    }
  ]
}
const mapConfig = {
  id: MAP_ID,
  zoom: 15,
  center: [37.3595704, 127.105399],
  type: 'satellite'
}

function olInit(geoserver, workspace, layers) {
  /**
   * @summary - Make OSM
   * @todo - option conatin id and substitute default configs
   */
  const styles = makeStyle()
  const naver = makeNaverMap(mapConfig)
  const openlayers = []

  for (const vectorConfig of layerConfig.vectorLayers) openlayers.push(makeVectorLayer(vectorConfig))

  if (geoserver) {
    if (layers.tiff) {
      const tiffLayer = makeTileLayer(geoserver, workspace, layers.tiff, ZINDEX_PVR - 4, true)
      openlayers.push(tiffLayer)
      ref.tiffLayer = tiffLayer
    }
    if (layers.draft) {
      const draftLayer = makeTileLayer(geoserver, workspace, layers.draft, ZINDEX_PVR - 3)
      openlayers.push(draftLayer)
      ref.draftLayer = draftLayer
    }
    if (layers.mission) {
      const missionLayer = makeTileLayer(geoserver, workspace, layers.mission, ZINDEX_PVR - 2)
      openlayers.push(missionLayer)
      ref.missionLayer = missionLayer
    }
    if (layers.recorded) {
      const recordedLayer = makeTileLayer(geoserver, workspace, layers.recorded, ZINDEX_PVR - 1)
      openlayers.push(recordedLayer)
      ref.recordedLayer = recordedLayer
    }
    ref.geoserver = geoserver
    ref.workspace = workspace
    ref.layers = layers
  }

  const map = makeOlMap(openlayers)
  map.styles = styles
  map.naver = naver
  ref.map = map
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

function setClickCB(callback) {
  /**
   * @summary - Make OpenLayers Main Map
   */
  ref.clickCallback = callback
}

export { olInit, setClickCB }
