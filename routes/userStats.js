var express = require('express');
const statsController = require('../controller/userStats');
var router = express.Router();
/* GET users listing. */
router.get('/getStat/:id',statsController.getStat);
router.get('/getStats',statsController.getStats);
router.post('/addStat',statsController.postStat);
router.put('/addTweet',statsController.addTweet);
router.put('/usrAccess',statsController.usrAccess);
router.put('/usrBaja',statsController.usrBaja);
router.delete('/deleteStats',statsController.deleteStats);

module.exports = router;
