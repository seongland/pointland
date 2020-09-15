/**
 * @summary - Event map module
 * @module
 */

import { transform } from 'ol/proj'
import { GeoJSON } from 'ol/format'
import { ref } from './meta'
import { ZOOM_DURATION, START_ZOOM } from './const'

function eventBind(map) {
  /**
   * @summary - OL Event Bind
   */
  map.naver.element = document.getElementById('naver')
  map.on('pointermove', () => changeMapLoc(map))
  map.on('moveend', () => ({
    loc: changeMapLoc(map),
    zoom: ChangeMapRatio(map)
  }))
  map.on('click', mapClick)
  return { loc: changeMapLoc(map), zoom: ChangeMapRatio(map) }
}

function mapClick(e) {
  /**
  * @summary - When Click Map
  */
  let coor = transform(e.coordinate, 'EPSG:3857', 'EPSG:4326')
  let extent = e.map.getView().calculateExtent()
  let leftBottom = transform(extent.slice(0, 2), 'EPSG:3857', 'EPSG:4326')
  let rightTop = transform(extent.slice(2, 4), 'EPSG:3857', 'EPSG:4326')
  let size = rightTop.map(function (e, i) { return e - leftBottom[i] })
  console.log(coor, size)
  getNearDraft(coor, size)
}


function getNearDraft(coor, size) {
  /**
  * @summary - Get Near Features & Get nearest feature
  */
  const draftURL = `${ref.geoserver}/${ref.workspace}/ows?service=WFS&version=1.0.0` +
    `&request=GetFeature&typeName=${ref.layers.draft}&outputFormat=application%2Fjson&`
  fetch(
    draftURL + bboxFilter(coor, size),
    { method: 'GET', mode: 'cors' }
  )
    .then(function (response) {
      return response.json()
    })
    .then(function (json) {
      let features = new GeoJSON().readFeatures(json)
      console.log(features)
    })
}


function bboxFilter(coor, size) {
  /**
  * @summary - Round Shaped D-WITHIN CQL filter
  */
  console.log(size)
  const factor = size[0] / 1000
  return `CQL_FILTER=BBOX(geom, ${coor[0] - factor}, ${coor[1] - factor}, ${coor[0] + factor}, ${coor[1] + factor})`
}


function changeMapLoc(map) {
  const lnglat = transform(map.getView().getCenter(), 'EPSG:3857', 'EPSG:4326')
  map.naver.setCenter({ x: lnglat[0], y: lnglat[1] })
}


function setFocus(lat, lng) {
  let coor = transform([lng, lat], 'EPSG:4326', 'EPSG:3857')
  ref.map.getView().animate({ center: coor, duration: 0 })
}

function setZoom(follow) {
  if (follow) return
  const view = ref.map.getView()
  const zoom = view.getZoom()
  view.animate({ zoom: zoom - 1, duration: ZOOM_DURATION },
    { zoom: START_ZOOM, duration: ZOOM_DURATION * Math.ceil(Math.abs(START_ZOOM - (zoom - 1)) / 3) })
}

function ChangeMapRatio(map) {
  const zoom = Math.round(map.getView().getZoom())
  map.naver.setZoom(zoom)
  let olExtent = map.getView().calculateExtent()
  let olStartExt = transform(
    [olExtent[0], olExtent[1]],
    'EPSG:3857',
    'EPSG:4326'
  )
  let olEndExt = transform([olExtent[2], olExtent[3]], 'EPSG:3857', 'EPSG:4326')
  let olSideX = olEndExt[0] - olStartExt[0]
  let olSideY = olEndExt[1] - olStartExt[1]
  let naverStartX = map.naver.getBounds()._min.x
  let naverEndX = map.naver.getBounds()._max.x
  let naverStartY = map.naver.getBounds()._min.y
  let naverEndY = map.naver.getBounds()._max.y
  let naverSideX = naverEndX - naverStartX
  let naverSideY = naverEndY - naverStartY
  let naverRatioX = naverSideX / olSideX
  let naverRatioY = naverSideY / olSideY
  for (const child of map.naver.element.children)
    child.style.transform = `scale(${(naverRatioX, naverRatioY)})`
}

export { eventBind, setFocus, setZoom }
