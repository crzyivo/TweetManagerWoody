const express = require('express');
const router = express.Router();
const ctrlMain =  require('../controllers/main');

router.get('/loginGoogle',ctrlMain.loginGoogle);
router.get('/loginGoogle/callback',ctrlMain.loginGoogle,ctrlMain.loginGoogleCallback);
module.exports = router;
