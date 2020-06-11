const express = require('express')
const router = express.Router()

router.post('/upload', upload)

function upload() {
  console.log('upload test')
}

module.exports = router
