/*
 * @summary - facility api addon end point module
 */

import { xyto84 } from '../tool/coor'

const GEO_JSON_TEMPLATE_4326 = {
  type: 'FeatureCollection',
  crs: { type: 'name', properties: { name: 'epsg:4326' } }
}

const GEO_JSON_TEMPLATE_32652 = {
  type: 'FeatureCollection',
  crs: { type: 'name', properties: { name: 'urn:ogc:def:crs:EPSG::32652' } }
}

export default app => {
  const near = async (req, res) => {
    const lng = req.params.lng
    const lat = req.params.lat
    const distance = Number(req.params.distance)
    const facilityService = app.service('facility')

    let query = {}
    if (distance > 0)
      query.$and = [
        {
          geometry: {
            $near: {
              $geometry: { type: 'Point', coordinates: [lng, lat] },
              $maxDistance: distance
            }
          }
        }
      ]
    const facilities = await facilityService.Model.find(query)
    res.json(facilities)
  }

  const nearLayer = async (req, res) => {
    let query
    const lng = req.params.lng
    const lat = req.params.lat
    const layer = req.params.layer
    const distance = Number(req.params.distance)
    const facilityService = app.service('facility')

    if (distance > 0)
      query = {
        $and: [
          {
            geometry: {
              $near: {
                $geometry: { type: 'Point', coordinates: [lng, lat] },
                $maxDistance: distance
              }
            }
          },
          { 'properties.layer': { $eq: layer } }
        ]
      }
    else query = { 'properties.layer': { $eq: layer } }
    const facilities = await facilityService.Model.find(query)
    res.json(facilities)
  }

  const exporter = async (req, res) => {
    const layer = req.params.layer
    const crs = req.params.crs
    const facilityService = app.service('facility')
    const facilities = await facilityService.Model.find({ 'properties.layer': layer })
    let geoJson
    if (crs === '4326') geoJson = { ...GEO_JSON_TEMPLATE_4326, features: facilities }
    else if (crs === '32652') {
      const facilities32652 = facilities.map(f => {
        f.geometry.coordinates[0] = f.properties.x
        f.geometry.coordinates[1] = f.properties.y
        f.geometry.coordinates[2] = f.properties.z
        f.properties.x = undefined
        f.properties.y = undefined
        f.properties.z = undefined
        return f
      })
      geoJson = { ...GEO_JSON_TEMPLATE_32652, features: facilities32652 }
    } else geoJson = { ...GEO_JSON_TEMPLATE_4326, features: facilities }
    res.json(geoJson)
  }

  const importer = async (req, res) => {
    const layer = req.params.layer
    const facilities = req.body.features
    const crs = req.params.crs
    const facilityService = app.service('facility')
    const promises = []

    for (const facility of facilities) {
      const props = facility.properties
      const geom = facility.geometry
      props.layer = layer
      facility.id = props.id ? props.id : props.ID
      facility.relations = {}

      // geometry
      if (crs === '32652') {
        if (facility.type === 'Point') {
          props.x = geom.coordinates[0]
          props.y = geom.coordinates[1]
          props.z = geom.coordinates[2]
          geom.coordinates = xyto84(props.x, props.y)
        } else if (geom.type === 'MultiLineString' && geom.coordinates.length === 1) {
          geom.type = 'LineString'
          geom.coordinates = geom.coordinates[0]
          props.xyzs = []
          for (const xyz of geom.coordinates) {
            props.xyzs.push([xyz[0], xyz[1], xyz[2]])
            const lnglat = xyto84(xyz[0], xyz[1])
            xyz[0] = lnglat[0]
            xyz[1] = lnglat[1]
          }
        } else if (geom.type === 'MultiPolygon' && geom.coordinates.length === 1) {
          geom.type = 'Polygon'
          geom.coordinates = geom.coordinates[0]
          props.xyzs = []
          for (const polyline of geom.coordinates) {
            const tempArray = []
            props.xyzs.push(tempArray)
            for (const xyz of polyline) {
              tempArray.push([xyz[0], xyz[1], xyz[2]])
              const lnglat = xyto84(xyz[0], xyz[1])
              xyz[0] = lnglat[0]
              xyz[1] = lnglat[1]
            }
          }
        }
      }

      props.layer = layer
      promises.push(facilityService.Model.create(facility))
    }
    res.json(await Promise.all(promises))
  }

  app.get('/facility/export/:layer', exporter)
  app.get('/facility/export/:layer/:crs', exporter)
  app.get('/facility/near/:lng/:lat/:distance', near)
  app.get('/facility/near/:lng/:lat/:distance/:layer', nearLayer)

  app.post('/facility/import/:layer/:crs', importer)
}
