const GEO_JSON_TEMPLATE_4326 = {
  type: 'FeatureCollection',
  crs: { type: 'name', properties: { name: 'epsg:4326' } }
}

const GEO_JSON_TEMPLATE_32652 = {
  type: 'FeatureCollection',
  crs: { type: 'name', properties: { name: 'urn:ogc:def:crs:EPSG::32652' } }
}

export const exporter = app => {
  return async (req, res) => {
    /*
     * @summary - facility exporter
     */
    const layer = req.params.layer
    const crs = req.params.crs
    const facilityService = app.service('facility')
    const facilities = await facilityService.Model.find({
      'properties.layer': layer
    })
    let geoJson
    if (crs === '4326')
      geoJson = {
        ...GEO_JSON_TEMPLATE_4326,
        features: facilities
      }
    else if (crs === '32652') {
      const facilities32652 = facilities.map(f => {
        if (f.geometry.type === 'Point') {
          f.geometry.coordinates[0] = f.properties.x
          f.geometry.coordinates[1] = f.properties.y
          f.geometry.coordinates[2] = f.properties.z
          f.properties.x = undefined
          f.properties.y = undefined
          f.properties.z = undefined
        } else {
          f.geometry.coordinates = f.properties.xyzs
          f.properties.xyzs = undefined
        }
        return f
      })
      geoJson = {
        ...GEO_JSON_TEMPLATE_32652,
        features: facilities32652
      }
    } else
      geoJson = {
        ...GEO_JSON_TEMPLATE_4326,
        features: facilities
      }
    res.json(geoJson)
  }
}
