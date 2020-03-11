var express = require('express')
var router = express.Router()
var models = require('../../models')

router.get("/nearnode/:node_id", function(req, res, next){
  
  let from = req.params.node_id
  models.relation.findAll({
    where: {
      from: from
    }
  }).then(result => {
    res.json(result)
  }).catch(err => {
      console.log(err)
  })
})

module.exports = router
