/**
 * @summary - Map draw module
 * @module
 */

import { fromLonLat } from 'ol/proj'
import { Fill, Circle, Style } from 'ol/style'
import { Point } from 'ol/geom'
import { Feature } from 'ol'
import { setFocus } from "./event"
import { RED, BLUE, DFT_RADIUS, ZINDEX_DRAW } from './const'
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
  styles = {
    ...styles,
    circleRed: new Style({ image: ciRedI }),
    circleBlue: new Style({ image: ciBlueI }),
  }
  styles.circleBlue.setZIndex(ZINDEX_DRAW)
  styles.circleRed.setZIndex(ZINDEX_DRAW)
  return styles
}

function drawXY(latlng, focus) {
  /**
   * @summary - When Click Map
   */
  if (!latlng) return
  updateMarker(...latlng)
  if (focus) setFocus(...latlng)
}

function drawXYs(latlngArray) {
  /**
   * @summary - When Click Map
   */
  if (!latlngArray.length) return
  let latlng
  for (latlng of latlngArray) addCircle(...latlng)
}

function addCircle(lat, lng) {
  /**
   * @summary - draw circle
   */
  let loc = fromLonLat([lng, lat])
  let coor = new Point(loc)
  const recordingLayer = ref.recordingLayer
  const feature = new Feature({ geometry: coor })
  recordingLayer.getSource().addFeatures([feature])
}

function updateMarker(lat, lng) {
  /**
   * @summary - update lyaer
   */
  let loc = fromLonLat([lng, lat])
  let coor = new Point(loc)
  const feature = new Feature({ geometry: coor })
  const currentLayer = ref.currentLayer
  currentLayer.getSource().clear()
  currentLayer.getSource().addFeatures([feature])
}

export { makeStyle, drawXY, drawXYs }
