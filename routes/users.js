var express = require('express');
const usrController = require('../controller/usersCtrl');
var router = express.Router();
/* GET users listing. */
router.get('/',usrController.usrGet);
router.post('/',usrController.usrPost);
router.post('/recover',usrController.usrPut);
router.put('/deleteAcc',usrController.accDelete);
router.put('/postAcc',usrController.accPost);
router.put('/changeUser/:email',usrController.usrPutEmail);
router.put('/',usrController.usrPut);
router.delete('/',usrController.usrDelete);
router.get('/getAcc',usrController.accGet);
router.get('/getAccs',usrController.accsGet);
router.put('/hashtag',usrController.accPosthashtag);
router.get('/hashtag',usrController.accGethashtag);
router.delete('/hashtag',usrController.accDeletehashtag);

module.exports = router;
