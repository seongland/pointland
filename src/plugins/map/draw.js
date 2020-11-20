/**
 * @summary - Map draw module
 * @module
 */

import { fromLonLat } from 'ol/proj'
import { Fill, Circle, Style, Stroke } from 'ol/style'
import { Point } from 'ol/geom'
import { Feature } from 'ol'
import Draw from 'ol/interaction/Draw'
import { setFocus } from './event'
import { RED, BLUE, DFT_RADIUS, DFT_WIDTH, WHITE, YELLOW } from './config'
import { ref } from './init'

function makeStyle() {
  /**
   * @summary - Make Diverse Style
   * @function
   */
  let styles = new Map()
  styles.prop = { fRed: new Fill({ color: RED }), fBlue: new Fill({ color: BLUE }) }
  let cricleDft = { radius: DFT_RADIUS }
  let ciRedI = new Circle({ ...cricleDft, fill: styles.prop.fRed })
  let ciBlueI = new Circle({ radius: DFT_RADIUS * 2, fill: styles.prop.fBlue })
  let lYellowI = new Stroke({ color: YELLOW, width: DFT_WIDTH })
  let lWhiteI = new Stroke({ color: WHITE, width: DFT_WIDTH * 2 })
  styles = {
    ...styles,
    circleRed: new Style({ image: ciRedI }),
    circleBlue: new Style({ image: ciBlueI }),
    strokeYellow: new Style({ stroke: lYellowI }),
    strokeWhite: new Style({ stroke: lWhiteI })
  }
  return styles
}

function makePointStyle({ color, radius }) {
  /**
   * @summary - Make Diverse Style
   * @function
   */
  const fill = new Fill({ color })
  const circle = new Circle({ radius, fill })
  const style = new Style({ image: circle })
  return style
}

function makeLineStyle({ color, width, fill }) {
  /**
   * @summary - Make Diverse Style
   * @function
   */
  const filled = new Fill({ color: fill })
  const stroke = new Stroke({ color, width })
  const style = new Style({ stroke, fill: filled })
  return style
}

function drawXY(layer, latlng, focus, id) {
  /**
   * @summary - When Click Map
   */
  if (!latlng) return
  updateMarker(layer, ...latlng, id)
  if (focus) setFocus(...latlng)
}

function removeFeature(layer, id) {
  /**
   * @summary - When Click Map
   */
  const src = layer.getSource()
  const feature = src.getFeatureById(id)
  if (feature) src.removeFeature(feature)
}

function drawXYs(latlngArray, id) {
  /**
   * @summary - When Click Map
   */
  if (!latlngArray.length) return
  for (const latlng of latlngArray) addCircle(...latlng, id)

  const recordingSource = ref.recordingLayer.getSource()
  const recordingArray = recordingSource.getFeatures()
  console.log(id, 'added', recordingArray.length)
}

function subtractVhcl(id) {
  // remove current
  const drawLayer = ref.drawLayer
  if (!drawLayer) return
  const legacy = drawLayer.getSource().getFeatureById(id)
  if (legacy) drawLayer.getSource().removeFeature(legacy)

  // remove recording
  const recordingSource = ref.recordingLayer.getSource()
  const recordingArray = recordingSource.getFeatures()

  for (const feature of recordingArray) {
    console.log(feature.get('vhcl') === id, feature.get('vhcl'))
    if (feature.get('vhcl') === id) recordingSource.removeFeature(feature)
  }
}

function addCircle(lat, lng, id) {
  /**
   * @summary - draw circle
   */
  let loc = fromLonLat([lng, lat])
  let coor = new Point(loc)
  const recordingLayer = ref.recordingLayer
  const feature = new Feature({ geometry: coor })
  feature.set('vhcl', id)
  recordingLayer.getSource().addFeatures([feature])
}

function updateMarker(layer, lat, lng, id) {
  /**
   * @summary - update lyaer
   */
  let loc = fromLonLat([lng, lat])
  let coor = new Point(loc)
  const feature = new Feature({ geometry: coor })
  feature.setId(id)
  const legacy = layer.getSource().getFeatureById(id)
  if (legacy) layer.getSource().removeFeature(legacy)
  layer.getSource().addFeatures([feature])
}

function setDrawInteraction(layerObj) {
  if (ref.map.draw) ref.map.removeInteraction(ref.map.draw)
  const source = ref.drawLayer.getSource()
  const draw = new Draw({
    source,
    type: layerObj.type
  })
  ref.map.draw = draw
  ref.map.addInteraction(draw)
}

export { makeLineStyle, makeStyle, drawXY, drawXYs, subtractVhcl, setDrawInteraction, makePointStyle, removeFeature }
