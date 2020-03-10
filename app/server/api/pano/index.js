const express = require('express');
const router = express.Router();
const ctrl = require('./ctrl');

//http://localhost:10010/api/pano/tile/00000/b/l1/1/l1_b_1_1.jpg

router.get('/tile/:node_id/:s/:level/:v/:image_name', ctrl.getTileImage);
router.get('/tile/:node_id', ctrl.getPanoxml);
router.get('/preview/:node_id', ctrl.getPreview);



module.exports = router;

