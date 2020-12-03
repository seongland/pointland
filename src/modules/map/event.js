/**
 * @summary - Event map module
 * @module
 */

import { transform } from 'ol/proj'
import { GeoJSON } from 'ol/format'
import { ref } from './init'
import { ZOOM_DURATION, START_ZOOM } from './config'
import { Vector } from 'ol/source'
import Point from 'ol/geom/Point'

function eventBind(map) {
  /**
   * @summary - OL Event Bind
   */
  map.naver.element = document.getElementById('naver')
  map.on('pointermove', () => changeMapLoc(map))
  map.on('moveend', () => {
    changeMapLoc(map)
    changeMapRatio(map)
    map.opt.callback.moveend()
  })
  map.on('click', mapClick)
  return { loc: changeMapLoc(map), zoom: changeMapRatio(map) }
}

async function mapClick(e) {
  /**
   * @summary - When Click Map
   */
  const tmpSrc = vectorCallback(e)
  const features = await geoserverCallback(e)

  for (const feature of features) tmpSrc.addFeature(feature)

  const closest = tmpSrc.getClosestFeatureToCoordinate(e.coordinate)
  if (closest) closest.callback.click(e, closest)
}

function vectorCallback(e) {
  const vectorOpts = ref.map.opt.layers.vector

  const tmpSrc = new Vector()
  for (const opt of vectorOpts) {
    const layer = ref[opt.name]
    if (!layer.getVisible()) continue
    if (opt?.callback?.click) {
      const feature = layer
        .getSource()
        .getClosestFeatureToCoordinate(e.coordinate, feature => feature.getGeometry() instanceof Point)
      if (feature) {
        feature.callback = opt.callback
        tmpSrc.addFeature(feature)
      }
    }
  }
  return tmpSrc
}

async function geoserverCallback(e) {
  let extent = e.map.getView().calculateExtent()
  let leftBottom = transform(extent.slice(0, 2), 'EPSG:3857', 'EPSG:4326')
  let rightTop = transform(extent.slice(2, 4), 'EPSG:3857', 'EPSG:4326')

  let coor = transform(e.coordinate, 'EPSG:3857', 'EPSG:4326')
  let size = rightTop.map((e, i) => e - leftBottom[i])

  const features = []
  const opts = ref.map.opt.layers.geoserver
  for (const layerServer of opts)
    if (layerServer.callback.click) {
      const layer = ref[layerServer.name]
      if (!layer.getVisible()) continue
      features.push(...(await getNearFeatures(coor, size, layerServer)))
    }
  return features
}

export async function getNearFeatures(coor, size, layerServer) {
  /**
   * @summary - Get Near Features & Get nearest feature
   */
  const url =
    `${ref.geoserver}/${ref.workspace}/ows?service=WFS&version=1.0.0` +
    `&request=GetFeature&typeName=${ref.layers[layerServer.key]}&outputFormat=application%2Fjson&`
  const res = await fetch(url + bboxFilter(coor, size), { method: 'GET', mode: 'cors' })
  const json = await res.json()
  const features = new GeoJSON({ dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857' }).readFeatures(json)
  for (const feature of features) feature.callback = layerServer.callback
  return features
}

function getNearestLineIndex(coor, features) {
  let index
  let maxDistance = 0
  for (const feature of features) {
    let [sumx, sumy] = [0, 0]
    const geometry = feature.getGeometry()
    const flatCoords = geometry.flatCoordinates
    flatCoords.filter((value, index) => {
      if (!(index % 2)) {
        sumx += value
        sumy += flatCoords[index + 1]
      }
    })
    const x = (2 * sumx) / flatCoords.length
    const y = (2 * sumy) / flatCoords.length
    const center = [x, y]
    const distance = Math.sqrt((center[0] - coor[0]) ** 2 + (center[1] - coor[1]) ** 2)
    if (distance > maxDistance) {
      index = features.indexOf(feature)
      maxDistance = distance
    }
  }
  return index
}

function bboxFilter(coor, size) {
  /**
   * @summary - Round Shaped D-WITHIN CQL filter
   */
  const factor = size[0] / 10
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
  view.animate(
    { zoom: zoom - 1, duration: ZOOM_DURATION },
    { zoom: START_ZOOM, duration: ZOOM_DURATION * Math.ceil(Math.abs(START_ZOOM - (zoom - 1)) / 3) }
  )
}

function changeMapRatio(map) {
  const zoom = Math.round(map.getView().getZoom())
  map.naver.setZoom(zoom)
  let olExtent = map.getView().calculateExtent()
  let olStartExt = transform([olExtent[0], olExtent[1]], 'EPSG:3857', 'EPSG:4326')
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
  for (const child of map.naver.element.children) child.style.transform = `scale(${(naverRatioX, naverRatioY)})`
}

export { eventBind, setFocus, setZoom }
