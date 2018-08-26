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
router.get('/twits/:account/:user',ctrlAcc.getAcc);
router.get('/accTokens',ctrlAcc.getTokens);

module.exports = router;