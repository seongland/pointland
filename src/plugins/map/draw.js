/**
 * @summary - Map draw module
 * @module
 */

import { fromLonLat } from 'ol/proj'
import { Fill, Circle, Style, Stroke } from 'ol/style'
import { Point } from 'ol/geom'
import { Feature } from 'ol'
import { setFocus } from "./event"
import { RED, BLUE, DFT_RADIUS, DFT_WIDTH, WHITE, YELLOW } from './const'
import { ref } from './meta'

function makeStyle() {
  /**
   * @summary - Make Diverse Style
   * @function
   */
  let styles = {}
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


function drawLine(feature) {
  console.log(feature, ref.drawMissionLayer.getSource())
  ref.drawMissionLayer.getSource().addFeature(feature)
}

function drawXY(latlng, focus, id) {
  /**
   * @summary - When Click Map
   */
  if (!latlng) return
  updateMarker(...latlng, id)
  if (focus) setFocus(...latlng)
}

function drawXYs(latlngArray, id) {
  /**
   * @summary - When Click Map
   */
  if (!latlngArray.length) return
  for (const latlng of latlngArray) addCircle(...latlng, id)

  const recordingSource = ref.recordingLayer.getSource()
  const recordingArray = recordingSource.getFeatures()
  console.log(id, "added", recordingArray.length)
}

function subtractVhcl(id) {
  // remove current
  console.log(id)
  const currentLayer = ref.currentLayer
  if (!currentLayer) return
  const legacy = currentLayer.getSource().getFeatureById(id)
  if (legacy) currentLayer.getSource().removeFeature(legacy)

  // remove recording
  const recordingSource = ref.recordingLayer.getSource()
  const recordingArray = recordingSource.getFeatures()

  console.log(recordingArray.length)

  for (const feature of recordingArray) {
    console.log(feature.get('vhcl') === id, feature.get('vhcl'))
    if (feature.get('vhcl') === id)
      recordingSource.removeFeature(feature)
  }

  console.log(recordingArray.length)
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


function updateMarker(lat, lng, id) {
  /**
   * @summary - update lyaer
   */
  let loc = fromLonLat([lng, lat])
  let coor = new Point(loc)
  const feature = new Feature({ geometry: coor })
  feature.setId(id)
  const currentLayer = ref.currentLayer
  const legacy = currentLayer.getSource().getFeatureById(id)
  if (legacy) currentLayer.getSource().removeFeature(legacy)
  currentLayer.getSource().addFeatures([feature])
}

export { drawLine, makeStyle, drawXY, drawXYs, subtractVhcl }
