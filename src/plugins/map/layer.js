/**
 * @summary - Map Layer Module
 * @module
 */

import { Tile, Vector as VectorLayer } from 'ol/layer'
import { TileWMS, XYZ, Vector } from 'ol/source'
import {
  DRAFT_LAYER,
  MISSION_LAYER,
  ZINDEX_PVR
} from '~/plugins/map/const'
import { GEOSERVER, WORKSPACE, NAVER_ID } from '~/plugins/map/const'
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

const makeRecordedLayer = (layer) => {
  /**
   * @summary - Get Marker Image Layer
   */
  let source = new TileWMS({
    url: `${GEOSERVER}${WORKSPACE}/wms`,
    params: { LAYERS: layer },
    ratio: 1,
    serverType: 'geoserver',
    crossOrigin: 'anonymous'
  })
  return new Tile({ source })
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

const makeMissionLayer = () => {
  /**
   * @summary - Get Marker Image Layer
   */
  let source = new TileWMS({
    url: `${GEOSERVER}${WORKSPACE}/wms`,
    params: { LAYERS: MISSION_LAYER },
    ratio: 1,
    serverType: 'geoserver',
    crossOrigin: 'anonymous'
  })
  const missionLayer = new Tile({ source })
  missionLayer.setZIndex(ZINDEX_PVR - 1)
  return missionLayer
}

const makeDraftLayer = () => {
  /**
   * @summary - Get Marker Image Layer
   */
  let source = new TileWMS({
    url: `${GEOSERVER}${WORKSPACE}/wms`,
    params: { LAYERS: DRAFT_LAYER },
    ratio: 1,
    serverType: 'geoserver',
    crossOrigin: 'anonymous'
  })
  let draftLayer = new Tile({ source })
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


const layers = {
  CODE42: "stx_mms:recorded",
  AIHUB: "stx_mms:aihub.recorded"
}

function changeProject(project) {
  console.log(project)
  if (ref.recordedLayer) ref.map.removeLayer(ref.recordedLayer)
  const recordedLayer = makeRecordedLayer(layers[project])
  ref.map.addLayer(recordedLayer)
  ref.recordedLayer = recordedLayer
}

export {
  changeProject,
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
