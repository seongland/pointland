/**
 * @summary - Map Layer Module
 * @module
 */

import { Tile, Vector as VectorLayer } from 'ol/layer'
import { TileWMS, XYZ, Vector } from 'ol/source'
import {
  ZINDEX_PVR
} from '~/plugins/map/const'
import { NAVER_ID } from '~/plugins/map/const'
import { ref } from './meta'


function makeGoogleLayer() {
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

function makeMBLayer() {
  /**
   * @summary - Get Open MapBox Layer
   */
  let key =
    'pk.eyJ1Ijoic2VvbmdsYWUiLCJhIjoiY2s3MDE0dHNtMWVueDNucDlhZHhkdjlrZyJ9.39bib8g2kspp44rI6MmAzw'
  let tile = {
    source: new XYZ({
      url:
        'https://api.mapbox.com/styles/v1/seonglae/ck701700t0rgf1imr4boh5n14/tiles/256/{z}/{x}/{y}@2x?' +
        'access_token=' +
        key
    })
  }
  return new Tile(tile)
}

const makeRecordedLayer = (geoserver, workspace, layer) => {
  /**
   * @summary - Get Marker Image Layer
   */
  let source = new TileWMS({
    url: `${geoserver}/${workspace}/wms`,
    params: { LAYERS: layer },
    ratio: 1,
    serverType: 'geoserver',
    crossOrigin: 'anonymous'
  })
  const recordedLayer = new Tile({ source })
  recordedLayer.setZIndex(ZINDEX_PVR - 2)
  return recordedLayer
}

const makeMissionLayer = (geoserver, workspace, layer) => {
  /**
   * @summary - Get Marker Image Layer
   */
  let source = new TileWMS({
    url: `${geoserver}/${workspace}/wms`,
    params: { LAYERS: layer },
    ratio: 1,
    serverType: 'geoserver',
    crossOrigin: 'anonymous'
  })
  const missionLayer = new Tile({ source })
  missionLayer.setZIndex(ZINDEX_PVR - 1)
  return missionLayer
}

const makeDraftLayer = (geoserver, workspace, layer) => {
  /**
   * @summary - Get Marker Image Layer
   */
  let source = new TileWMS({
    url: `${geoserver}/${workspace}/wms`,
    params: { LAYERS: layer },
    ratio: 1,
    serverType: 'geoserver',
    crossOrigin: 'anonymous'
  })
  let draftLayer = new Tile({ source })
  draftLayer.setZIndex(ZINDEX_PVR - 3)
  return draftLayer
}

function makeGSLayer() {
  /**
   * @summary - Make Google Satelite Map
   */
  let tile = {
    source: new XYZ({
      url: `https://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}&s=Ga`
    })
  }
  return new Tile(tile)
}

const makeRecordingLayer = (styles) => {
  /**
   * @summary - Make Draw Map
   */
  const tempArray = []
  const vectorSrc = new Vector({ features: tempArray })
  const recordingLayer = new VectorLayer({
    source: vectorSrc,
    style: styles.circleRed,
  })
  recordingLayer.styles = styles
  recordingLayer.setZIndex(ZINDEX_PVR)
  return recordingLayer
}

const makeCurrentLayer = (styles) => {
  /**
   * @summary - Make current draw Map
   */
  const tempArray = []
  const vectorSrc = new Vector({ features: tempArray })
  const currentLayer = new VectorLayer({
    source: vectorSrc,
    style: styles.circleBlue,
  })
  currentLayer.styles = styles
  currentLayer.setZIndex(ZINDEX_PVR + 1)
  return currentLayer
}

function makeNaverMap() {
  /**
   * @summary - Make Naver Map
   */
  let naverGPS = new naver.maps.LatLng(37.3595704, 127.105399)
  let NaverMapOptions = {
    center: naverGPS,
    zoom: 15,
    scaleControl: false,
    zoomControl: false,
    logoControl: false,
    mapDataControl: false,
    mapTypeControl: false,
    useStyleMap: true,
    baseTileOpacity: 1,
    draggable: false
  }
  return new naver.maps.Map(NAVER_ID, NaverMapOptions)
}


function changeLayers(geoserver, workspace, layers) {
  if (ref.draftLayer) ref.map.removeLayer(ref.draftLayer)
  if (ref.recordedLayer) ref.map.removeLayer(ref.recordedLayer)
  if (ref.missionLayer) ref.map.removeLayer(ref.missionLayer)
  const draftLayer = makeDraftLayer(geoserver, workspace, layers.draft)
  const recordedLayer = makeRecordedLayer(geoserver, workspace, layers.recorded)
  const missionLayer = makeMissionLayer(geoserver, workspace, layers.mission)
  ref.map.addLayer(draftLayer)
  ref.map.addLayer(recordedLayer)
  ref.map.addLayer(missionLayer)
  ref.draftLayer = draftLayer
  ref.recordedLayer = recordedLayer
  ref.missionLayer = missionLayer
  ref.recordingLayer.getSource().clear()
  ref.currentLayer.getSource().clear()
}

export {
  changeLayers,
  makeGoogleLayer,
  makeGSLayer,
  makeMBLayer,
  makeDraftLayer,
  makeRecordedLayer,
  makeMissionLayer,
  makeNaverMap,
  makeCurrentLayer,
  makeRecordingLayer
}
