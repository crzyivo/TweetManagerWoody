var express = require('express');
const tweetProgramadoController = require('../controller/tweetProgramadoCtrl');
var router = express.Router();

router.post('/',tweetProgramadoController.tweetPost);
router.get('/',tweetProgramadoController.tweetGet)
module.exports = router;
