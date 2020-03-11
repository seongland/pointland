const express = require('express');
const router = express.Router();
const ctrl = require('./ctrl');

router.get('/tile/:node_id/:s/:level/:v/:image_name', ctrl.getTileImage);
router.get('/tile/:node_id', ctrl.getPanoxml);
router.get('/preview/:node_id', ctrl.getPreview);

module.exports = router;
