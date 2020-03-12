import { Tile, Vector as VectorLayer } from 'ol/layer'
import { TileWMS, Vector, XYZ } from 'ol/source'

import { ZINDEX_PVR } from '~/plugins/map/const.js'
import { DRAW_LAYER_ID, PVR_LAYER, REL_LAYER } from '~/plugins/map/const.js'
import { GEOSERVER, WORKSPACE } from '~/plugins/map/const.js'


function makeDrawLayer(styles) {
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
}


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


function makePvrLayer() {
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
}


function makeRelLayer() {
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
}


function makeOSMLayer () {
  /**
   * @summary - Get Open Street Map Layer
   */
  let tile = { source: new ol.source.OSM({ crossOrigin: null })}
  return new ol.layer.Tile(tile)
}


function makeMBLayer()  {
  /**
   * @summary - Get Open MapBox Layer
   */
  let key = 'pk.eyJ1Ijoic2VvbmdsYWUiLCJhIjoiY2s3MDE0dHNtMWVueDNucDlhZHhkdjlrZyJ9.39bib8g2kspp44rI6MmAzw'
  let tile = {
    source: new ol.source.XYZ({
      url: 'https://api.mapbox.com/styles/v1/seonglae/ck701700t0rgf1imr4boh5n14/tiles/256/{z}/{x}/{y}@2x?' +
      'access_token=' + key
    })
  }
  return new ol.layer.Tile(tile)
}


function makeGSLayer () {
  /**
  * @summary - Make Google Satelite Map
  */
  let tile = {
    source: new ol.source.XYZ({
      url: `https://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}&s=Ga`
    })
  }
  return new ol.layer.Tile(tile)
}


export { makeDrawLayer, makeGoogleLayer, makePvrLayer, makeGSLayer, makeMBLayer, makeOSMLayer, makeRelLayer }
