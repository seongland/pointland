/*
 * @summary - facility api addon end point module
 */

import { exporter } from './exporter'
import { importer } from './importer'

export default app => {
  const geoWithin = async (req, res) => {
    /*
     * @summary - geowithin filter
     */
    const box = req.body.box
    const leftX = box[0][0]
    const leftY = box[0][1]
    const rightX = box[1][0]
    const rightY = box[1][1]
    const layer = req.params.layer
    const facilityService = app.service('facility')
    let query = {
      $and: [
        {
          geometry: {
            $geoIntersects: {
              $geometry: {
                type: 'Polygon',
                coordinates: [
                  [
                    [leftX, leftY],
                    [leftX, rightY],
                    [rightX, rightY],
                    [rightX, leftY],
                    [leftX, leftY]
                  ]
                ]
              }
            }
          }
        },
        { 'properties.layer': { $eq: layer } }
      ]
    }
    const facilities = await facilityService.Model.find(query)
    res.json(facilities)
  }

  const nearLayer = async (req, res) => {
    /*
     * @summary - near filter
     */
    let query
    const lng = req.params.lng
    const lat = req.params.lat
    const layer = req.params.layer
    const distance = Number(req.params.distance)
    const facilityService = app.service('facility')

    if (distance > 0)
      query = {
        $and: [
          { geometry: { $near: { $geometry: { type: 'Point', coordinates: [lng, lat] }, $maxDistance: distance } } },
          { 'properties.layer': { $eq: layer } }
        ]
      }
    else query = { 'properties.layer': { $eq: layer } }
    const facilities = await facilityService.Model.find(query)
    res.json(facilities)
  }

  app.get('/facility/export/:layer', exporter)
  app.get('/facility/export/:layer/:crs', exporter)
  app.get('/facility/near/:lng/:lat/:distance/:layer', nearLayer)

  app.post('/facility/box/:layer', geoWithin)
  app.post('/facility/import/:layer/:crs', importer)
}
