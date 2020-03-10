const express = require('express');
const router = express.Router();

const rounds_data = require('./rounds_data');
const pano = require('./pano');
// const upload = require('./upload');





router.use('/rounds_data', rounds_data);
router.use('/pano', pano);
// router.use('/', upload);


module.exports = router;