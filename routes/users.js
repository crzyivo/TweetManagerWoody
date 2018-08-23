var express = require('express');
const usrController = require('../controller/usersCtrl');
var router = express.Router();
/* GET users listing. */
router.get('/',usrController.usrGet);
router.post('/',usrController.usrPost);
router.post('/recover',usrController.usrPut);
router.put('/',usrController.usrPut);
router.delete('/',usrController.usrDelete);
router.put('/deleteAcc',usrController.accDelete);
router.put('/postAcc',usrController.accPost);
router.get('/getAcc',usrController.accGet);

module.exports = router;
