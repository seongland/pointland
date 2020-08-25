/**
 * @summary - Map Constant Module
 */

// Map
export const INIT_ZOOM = 12
export const START_POINT = [126.972, 37.5293]
export const MAP_ID = 'ol'

export const DRAW_LAYER_ID = 12
export const BLUE = '#35C', RED = '#F36'
export const ZINDEX_OL = 10
export const ZINDEX_REL = ZINDEX_OL + 1,
  ZINDEX_PVR = ZINDEX_OL + 2,
  ZINDEX_SEL = ZINDEX_OL + 3,
  ZINDEX_DRAW = ZINDEX_OL + 4
export const DFT_RADIUS = 3
// Geoserver
export const DELTA = 0.01
export const WORKSPACE = 'stx_mms'
export const DFT_RECORDED = 'recorded'
export const DRAFT_LAYER = WORKSPACE + ':draft'
export const RECORDED_LAYER = WORKSPACE + `:${DFT_RECORDED}`
export const MISSION_LAYER = WORKSPACE + ':mission'
export const GEOSERVER = 'http://app.stryx.co.kr:18090/geoserver/'
export const FOCUS_DURATION = 0
export const ZOOM_DURATION = 400
export const START_ZOOM = 17
export const NAVER_ID = 'naver'
