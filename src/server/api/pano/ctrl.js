/**
 * @summary - Panorama API main
 * @poi - reduce sql call by pass row
 */

const fs = require('fs')
const TILE_FOLDER = 'tiles_recolor/'
const BACKPACK_FOLDER = 'tiles_rollpitch/'
const NAS = '\\\\10.0.0.148\\smms_output'
const API_FOLER = '/server/api'
var models = require('../../models')
var xml2js = require('xml2js')

function getNodeInfo(node_id) {
  return new Promise(resolve => {
    let pvr_row
    models.pvr
      .findAll({
        where: { pvrid: node_id }
      })
      .then(result => {
        pvr_row = result[0].dataValues
        let round_path = pvr_row.sourcepath
        // poi - add seq
        resolve({ round_path: round_path, seq: pvr_row.seq })
      })
      .catch(err => {
        console.log(err)
        //poi: error handling
      })
  })
}

exports.getTileImage = async (req, res, next) => {
  try {
    const node_id = req.params.node_id
    const s = req.params.s
    const level = req.params.level
    const v = req.params.v
    const image_name = req.params.image_name

    getNodeInfo(node_id).then(row => {
      let imagePath = getTileFolder(row.round_path, row.seq) + '/images'
      imagePath = imagePath.replace(/\//gi, '\\')
      imagePath = NAS + imagePath.split(':')[1]
      let suffixPath = '/' + s + '/' + level + '/' + v + '/' + image_name
      imagePath = imagePath + suffixPath
      let imageBuf = fs.readFileSync(imagePath)
      res.send(imageBuf)
    })
  } catch (error) {
    console.error(error)
    next(error)
  }
}

exports.getPanoxml = async (req, res, next) => {
  try {
    let builder = new xml2js.Builder()
    const node_id = req.params.node_id
    const serverHost = req.protocol + '://' + req.get('Host')
    let tilePrepender = serverHost + API_FOLER + '/pano/tile/' + node_id
    let previewPrepender = serverHost + API_FOLER + '/pano/preview/' + node_id

    getNodeInfo(node_id).then(row => {
      let xmlFilePath = getTileFolder(row.round_path, row.seq) + '/pano.xml'
      xmlFilePath = xmlFilePath.replace(/\//gi, '\\')
      xmlFilePath = NAS + xmlFilePath.split(':')[1]
      console.log(`\n XML path ${xmlFilePath} \n`)
      res.set('Content-Type', 'text/xml')
      fs.readFile(xmlFilePath, 'utf8', function(err, data) {
        let strXML = data
        xml2js.parseString(strXML, function(err, parsedJson) {
          parsedJson.krpano.preview[0].$.url = parsedJson.krpano.preview[0].$.url.replace(
            'images/preview.jpg',
            previewPrepender
          )
          parsedJson.krpano.image[0].level.forEach(level => {
            level.cube[0].$.url = level.cube[0].$.url.replace(
              'images',
              tilePrepender
            )
          })
          let strXmlGen = builder.buildObject(parsedJson)
          console.log(strXmlGen)
          res.send(strXmlGen)
        })
      })
    })
  } catch (error) {
    console.error(error)
    next(error)
  }
}

exports.getPreview = async (req, res, next) => {
  try {
    const node_id = req.params.node_id
    getNodeInfo(node_id).then(row => {
      let imagePath =
        getTileFolder(row.round_path, row.seq) + '/images/preview.jpg'
      imagePath = imagePath.replace(/\//gi, '\\')
      imagePath = NAS + imagePath.split(':')[1]
      let imageBuf = fs.readFileSync(imagePath)
      res.send(imageBuf)
    })
  } catch (error) {
    console.error(error)
    next(error)
  }
}

function getTileFolder(roundPath, seq) {
  if (roundPath.search('backpack') >= 0)
    return `${roundPath}/${BACKPACK_FOLDER}${seq}_Panorama`
  else return `${roundPath}/${TILE_FOLDER}${seq}_Panorama`
}
