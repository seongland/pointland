/**
 * @summary - Map Constant Module
 */

import { Icon, Style } from 'ol/style'
import { BASE64_SVG, COMP_RAD, π, COS, SIN, ZINDEX_SEL } from '~/plugins/map/const.js'

function makeArcStyle(heading, fov) {
  let start = -fov / 2 - 90
  let arc = arcSVG(COMP_RAD, COMP_RAD, COMP_RAD / 2, COMP_RAD / 2, start, fov, heading)
  let svg = makeSVGByPath(arc, COMP_RAD * 2)

  let img = new Icon({
    src: svg,
    imgSize: [COMP_RAD * 2, COMP_RAD * 2]
  })
  let arcStyle = new Style({ image: img })
  arcStyle.setZIndex(ZINDEX_SEL)
  return arcStyle
}

function makeSVGByPath(path, size) {
  /**
   * @summary - Make Arc by Path
   */
  let svg = document.createElement("svg")
  svg.appendChild(path)
  svg.setAttributeNS(null, 'style', `fill:rgba(37, 51, 99, 0.5)`)
  svg.setAttributeNS(null, 'width', `${size}`)
  svg.setAttributeNS(null, 'height', `${size}`)
  svg.setAttributeNS(null, 'version', "1.0")
  svg.setAttributeNS(null, 'viewBox', `0 0 ${size} ${size}`)
  svg.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns', 'http://www.w3.org/2000/svg')
  svg = window.btoa(svg.outerHTML)
  return svg = BASE64_SVG + svg
}


function deg2rad (degree) {return degree * (π / 180)}
function vectorAdd ([a1, a2], [b1, b2]) {return [a1 + b1, a2 + b2]}
function rotateMatrix (x) {return [[COS(x), -SIN(x)], [SIN(x), COS(x)]]}
function matrixTimes ([[a, b], [c, d]], [x, y]) {return [a * x + b * y, c * x + d * y]}


function arcSVG (cx, cy, rx, ry, start, angle, rotate) {
  /**
   * @summary - Make Arc Path Main function
   * @param {pixel} cx - center position x
   * @param {pixel} cy - center position y
   * @param {pixel} rx - major radius x
   * @param {pixel} ry - minor radius y
   * @param {degree} start - start angle
   * @param {degree} angle - angle to sweep (positive)
   * @param {degree} rotate - rotation on the whole
   */
  angle = deg2rad(angle)
  start = deg2rad(start)
  rotate = deg2rad(rotate)
  angle = angle % (2 * π);
  let rotMatrix = rotateMatrix(rotate);
  let [sX, sY] = (vectorAdd(matrixTimes(rotMatrix, [rx * COS(start), ry * SIN(start)]), [cx, cy]))
  let [eX, eY] = (vectorAdd(matrixTimes(rotMatrix, [rx * COS(start + angle), ry * SIN(start + angle)]), [cx, cy]))
  let fA = ((angle > π) ? 1 : 0)
  let fS = ((angle > 0) ? 1 : 0)
  let path_2wk2r = document.createElementNS("http://www.w3.org/2000/svg", "path")
  path_2wk2r.setAttribute("d", `M ${cx} ${cy} ` + sX + " " + sY + ` A ` + [rx, ry, rotate / (2 * π) * 360, fA, fS, eX, eY].join(" "))
  return path_2wk2r
}

export { makeArcStyle }
