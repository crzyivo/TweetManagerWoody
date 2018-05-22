const express = require('express');
const router = express.Router();
const ctrlMain =  require('../controllers/main');

router.get('/loginGoogle',ctrlMain.loginGoogle);
router.get('/loginGoogle/callback',ctrlMain.loginGoogle,ctrlMain.loginGoogleCallback);
router.get('/loginTwitter',ctrlMain.loginTwitter);
router.get('/loginTwitter/callback',ctrlMain.loginTwitter,ctrlMain.loginTwitterCallback);
module.exports = router;
