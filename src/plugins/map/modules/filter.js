import { DELTA } from '~/plugins/map/modules/const.js'

function squareFilter(coor, size) {
  /**
   * @summary - Squrare Shaped lat lon squaure CQL filter
   */
  return (
    `CQL_FILTER=${coor[0] - DELTA * size[1]}<lon and lon<${coor[0] +
      DELTA * size[1]}` +
    `and lat<${coor[1] + DELTA * size[1]} and ${coor[1] - DELTA * size[1]}<lat`
  )
}

function roundFilter(coor, size) {
  /**
   * @summary - Round Shaped D-WITHIN CQL filter
   */
  return `CQL_FILTER=DWITHIN(geom,POINT(${coor[0]} ${coor[1]}),${size[0] +
    size[1]},kilometers)`
}

function pvrIdFilter(pvrid) {
  /**
   * @summary - PvrID CQL filter
   */
  return `CQL_FILTER=pvrid=${pvrid}`
}

export { pvrIdFilter, roundFilter, squareFilter }
