let express = require('express')
let router = express.Router()
let models = require('../../models')


deg2rad = degree => degree * (π / 180)
rad2deg = radian => radian * (180 / π)


function relationPan(lat1, lon1, lat2, lon2){
  return rad2deg(Math.atan2(cos(lat2)*Math.sin(lon2 - lon1), Math.cos(lat1)*Math.sin(lat2) - Math.sin(lat1)*Math.cos(lat2)*Math.cos(lon2-lon1)))
}


pad = (n, width) => {
  n += ''
  return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n
}


router.get('/journeys', function(req, res, next) {
  models.journeys.findAll()
  .then(results => {
    let journeyResultList = results
    console.log(results[0].dataValues.journey_name)

    let journeyNameList = []
    for(let i = 0 ; i < journeyResultList.length; i++){
      let journeyName = journeyResultList[i].dataValues.journey_name
      journeyNameList.push(journeyName)
    }
    let responseText = JSON.stringify(journeyNameList)
    res.send(responseText)
  })
})


module.exports = router
