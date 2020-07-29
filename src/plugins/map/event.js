/**
 * @summary - Event map module
 * @module
 */

import { transform } from 'ol/proj'
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
  return { loc: changeMapLoc(map), zoom: ChangeMapRatio(map) }
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
