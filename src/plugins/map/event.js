import { Vector } from 'ol/source'
import { fromLonLat, transform } from 'ol/proj'
import { Feature } from 'ol'
import { Point } from 'ol/geom'
import { GeoJSON } from 'ol/format'
import { getDrawLayer } from '~/plugins/map/meta'
import { makeArcStyle } from '~/plugins/map/draw'
import { roundFilter, pvrIdFilter } from '~/plugins/map/filter'
import { π, ARC_FID, PVR_URL, ATAN } from '~/plugins/map/const'

function getArc(drawLayer) {
  return drawLayer.get('source').getFeatureById(ARC_FID)
}

function eventBind(map) {
  /**
   * @summary - OL Event Bind
   */
  map.on('click', mapClick)
}

function mapClick(e) {
  /**
   * @summary - When Click Map
   */
  let coor = transform(e.coordinate, 'EPSG:3857', 'EPSG:4326')
  let extent = e.map.getView().calculateExtent()
  let leftBottom = transform(extent.slice(0, 2), 'EPSG:3857', 'EPSG:4326')
  let rightTop = transform(extent.slice(2, 4), 'EPSG:3857', 'EPSG:4326')
  let size = rightTop.map((e, i) => {
    return e - leftBottom[i]
  })
  let drawLayer = getDrawLayer(e.map)
  getNears(coor, size, drawLayer)
}

function getNears(coor, size, drawLayer) {
  /**
   * @summary - Get Near Features & Get nearest feature
   */
  fetch(PVR_URL + roundFilter(coor, size), { method: 'GET', mode: 'cors' })
    .then(response => {
      return response.json()
    })
    .then(json => {
      let features = new GeoJSON().readFeatures(json)

      // Else Move Pano
      if (features.length === 0) return panoMovebyMap(coor, drawLayer)
      let feature = getNearest(features, coor)
      drawSelect(feature, drawLayer)
      let pano = drawLayer.map.pano
      pano.AvatarMove({
        nodeid: feature.get('pvrid')
      })
    })
}

function panoMovebyMap(coor, drawLayer) {
  let arc = getArc(drawLayer)
  if (!arc) return
  let arcPoint = arc.get('geometry').flatCoordinates
  let arcCoor = transform(arcPoint, 'EPSG:3857', 'EPSG:4326')
  let angle = cptMapAngle(...arcCoor, ...coor)
  changeArc(angle, 90, drawLayer.map)
  let heading = 360 - drawLayer.selected.get('heading')
  console.log('angle', angle)
  angle = angle - heading
  console.log('heading', heading)
  let pano = drawLayer.map.pano
  pano.SetHorizontalLookAngle(angle)
}

function getNearest(features, coor) {
  /**
   * @summary - Get nearest feature
   */
  let vectorSource = new Vector({
    format: new GeoJSON()
  })
  vectorSource.addFeatures(features)
  return vectorSource.getClosestFeatureToCoordinate(coor)
}

function drawSelect(feature, drawLayer) {
  let lonlat = [feature.get('lon'), feature.get('lat')]
  let loc = fromLonLat(lonlat)
  let coor = new Point(loc)
  let heading = -feature.get('heading')
  drawLayer.selected = feature
  feature = new Feature({ geometry: coor })
  drawLayer.getSource().clear()
  drawLayer.getSource().addFeature(feature)
  drawCompass(heading, coor, drawLayer)
}

function drawCompass(heading, coor, drawLayer) {
  /**
   * @summary - Make Panorama Rotating Compass
   */

  // round Area
  let feature = new Feature({ geometry: coor })
  feature.setStyle([drawLayer.styles.circleAlpha, drawLayer.styles.circleWhite])
  drawLayer.getSource().addFeature(feature)

  // Compass
  let fov = 90
  let arcStyle = makeArcStyle(heading, fov)
  feature = new Feature({ geometry: coor })
  feature.setStyle(arcStyle)
  feature.setId(ARC_FID)
  drawLayer.getSource().addFeature(feature)
}

function changeArc(heading, fov, map) {
  heading = heading % 360
  let drawLayer = getDrawLayer(map)
  let arc = getArc(drawLayer)
  let arcStyle = makeArcStyle(heading, fov)
  arc.setStyle(arcStyle)
}

function cptMapAngle(x_m, y_m, x_w, y_w) {
  /**
   * Compute angle from +y axis of map by counter-clockwise
   * @todo - TM scope
   */
  let z = (x_m - x_w) / (y_m - y_w)
  let angle = (π / 2 - ATAN(z)) * (180 / π)
  if (y_m - y_w > 0) return 270 - angle
  else return (450 - angle) % 360
}


function changeFeaturebyID(pvrid, map) {
  let drawLayer = getDrawLayer(map)
  fetch(PVR_URL + pvrIdFilter(pvrid), { method: 'GET', mode: 'cors' })
    .then(response => {
      return response.json()
    })
    .then(json => {
      let features = new GeoJSON().readFeatures(json)
      if (features.length === 0) return alert('No Feature In Geoserver')
      let feature = features[0]
      drawSelect(feature, drawLayer)
      drawLayer.map.pano.AvatarMove({
      nodeid: pvrid
      })
    })
}


export { eventBind, changeArc, changeFeaturebyID }
