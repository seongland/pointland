const express = require('express')
const router = express.Router()
const pano = require('./pano')
const routes = require('./routes')
router.use('/pano', pano)
router.use('/routes', routes)
module.exports = router
