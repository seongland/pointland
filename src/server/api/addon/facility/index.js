/*
 * @summary - facility api addon end point module
 */

const GEO_JSON_TEMPLATE_4326 = {
  type: 'FeatureCollection',
  crs: {
    type: 'name',
    properties: {
      name: 'epsg:4326'
    }
  }
}

const GEO_JSON_TEMPLATE_32652 = {
  type: 'FeatureCollection',
  crs: { type: 'name', properties: { name: 'urn:ogc:def:crs:EPSG::32652' } }
}

export default app => {
  const near = async (req, res) => {
    const lng = req.params.lng
    const lat = req.params.lat
    const facilityService = app.service('facility')
    const facilities = await facilityService.Model.find({
      geometry: {
        $near: {
          $geometry: { type: 'Point', coordinates: [lng, lat] },
          $maxDistance: 50
        }
      }
    })
    res.json(facilities)
  }

  const nearLayer = async (req, res) => {
    const lng = req.params.lng
    const lat = req.params.lat
    const layer = req.params.layer
    const facilityService = app.service('facility')
    const query = {
      $and: [
        {
          geometry: {
            $near: {
              $geometry: { type: 'Point', coordinates: [lng, lat] },
              $maxDistance: 50
            }
          }
        },
        { 'properties.layer': { $eq: layer } }
      ]
    }
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

  app.get('/facility/export/:layer', exporter)
  app.get('/facility/export/:layer/:crs', exporter)
  app.get('/facility/near/:lng/:lat', near)
  app.get('/facility/near/:lng/:lat/:layer', nearLayer)
}
