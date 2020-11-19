import { xyto84 } from '../tool/coor'

export const importer = app => {
  return async (req, res) => {
    /*
     * @summary - geojson facility importer
     */
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
        if (geom.type === 'Point') {
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
}
