const express = require('express')
const router = express.Router()
const pano = require('./pano')
router.use('/pano', pano)
module.exports = router
