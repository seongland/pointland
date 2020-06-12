import { Tile } from 'ol/layer'
import { TileWMS, XYZ } from 'ol/source'
import { ZINDEX_PVR } from '~/plugins/map/const'
import { RECORDED_LAYER, DRAFT_LAYER } from '~/plugins/map/const'
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

export { makeGoogleLayer, makeGSLayer, makeMBLayer }
