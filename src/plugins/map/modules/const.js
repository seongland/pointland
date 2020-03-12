/**
 * @summary - Map Constant Module
 */

// Map
export const START_ZOOM = 12
export const DRAW_LAYER_ID = 12
export const START_POINT = [126.972, 37.5293]
export const RED = '#F36', WHITE = '#FFF', ALPHA = [30, 50, 130, 0.2]
export const ZINDEX_OL = 10
export const ZINDEX_REL = ZINDEX_OL + 1, ZINDEX_PVR = ZINDEX_OL + 2, ZINDEX_SEL = ZINDEX_OL + 3


// Draw
export const ARC_FID = 100
export const COMP_RAD = 50
export const BASE64_SVG = 'data:image/svg+xml;base64,'
export const DFT_RADIUS = 3
export const STROKE = 2



// Geoserver
export const DELTA = 0.01
export const WORKSPACE = 'stx_sriver_2019_1'
export const PVR_LAYER = WORKSPACE + ':stpano-nodes'
export const REL_LAYER = WORKSPACE + ':stpano-relation'
export const GEOSERVER = 'http://stryx.iptime.org:7545/geoserver/'
export const PVR_URL =
  `${GEOSERVER}${WORKSPACE}/ows?service=WFS&version=1.0.0` +
  `&request=GetFeature&typeName=${PVR_LAYER}&outputFormat=application%2Fjson&`

// Math
export const COS = Math.cos
export const SIN = Math.sin
export const π = Math.PI
export const ATAN = Math.atan
