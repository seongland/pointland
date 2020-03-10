const express = require('express');
const router = express.Router();
const ctrl = require('./ctrl');

router.get('/all', ctrl.getAllTrajNodes);
router.get('/node/:node_id', ctrl.getTrajNodeById);

module.exports = router;