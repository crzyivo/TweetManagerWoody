var express = require('express');
const usrController = require('../controller/usersCtrl');
var router = express.Router();
/* GET users listing. */
router.get('/',usrController.usrGet);
router.post('/',usrController.usrPost);
router.put('/',usrController.usrPut);
router.delete('/',usrController.usrDelete);

module.exports = router;
