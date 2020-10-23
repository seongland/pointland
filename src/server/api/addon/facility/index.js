export default app => {
  const near = async (req, res) => {
    const lng = req.params.lng
    const lat = req.params.lat
    const facilityService = app.service('facility')
    const facilities = await facilityService.Model.find({
      geometry: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [lng, lat]
          },
          $maxDistance: 50
        }
      }
    })
    res.json(facilities)
  }

  app.get('/facility/near/:lng/:lat', near)
}
