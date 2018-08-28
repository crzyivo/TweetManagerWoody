const express = require('express');
const router = express.Router();
const ctrlAcc =  require('../controllers/account');

// extrae las contraseñas de un usuario
router.get('/',ctrlAcc.recover);
router.put('/deleteAcc',ctrlAcc.deleteAcc);
router.put('/insertAcc',ctrlAcc.postAcc);
router.get('/show',ctrlAcc.TWExtract);
router.get('/show/callback',ctrlAcc.TWExtract,ctrlAcc.TWCallback);
router.get('/tokens/callback',ctrlAcc.getTokens,ctrlAcc.getTokensCallback);
router.get('/twits/home/:account/:user',ctrlAcc.getAcc);
router.get('/twits/user/:account/:user',ctrlAcc.getAccUser);
router.get('/twits/mentions/:account/:user',ctrlAcc.getAccMentions);
router.post('/twits/newTweet/:account/:user',ctrlAcc.postAccTweet);
router.post('/addUrl',ctrlAcc.postUrlShorten);
router.get('/accTokens',ctrlAcc.getTokens);
router.get('/twits/programados/:account/:user',ctrlAcc.getProgramados);
router.post('/twits/programados/:account/:user',ctrlAcc.postProgramados);
router.post('/twits/newProgTweet/:account/:user',ctrlAcc.sendProgTweet);

module.exports = router;