import { Tile } from 'ol/layer'
import { TileWMS, XYZ } from 'ol/source'
import {
  RECORDED_LAYER,
  DRAFT_LAYER,
  MISSION_LAYER,
  ZINDEX_PVR
} from '~/plugins/map/const'
import { GEOSERVER, WORKSPACE } from '~/plugins/map/const'

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

const makeRecordedLayer = () => {
  /**
   * @summary - Get Marker Image Layer
   */
  let source = new TileWMS({
    url: `${GEOSERVER}${WORKSPACE}/wms`,
    params: { LAYERS: RECORDED_LAYER },
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

export {
  makeGoogleLayer,
  makeGSLayer,
  makeMBLayer,
  makeDraftLayer,
  makeRecordedLayer,
  makeMissionLayer
}
