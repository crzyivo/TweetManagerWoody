const express = require('express');
const router = express.Router();
const ctrlMain =  require('../controllers/main');

router.get('/loginGoogle',ctrlMain.loginGoogle);
module.exports = router;
