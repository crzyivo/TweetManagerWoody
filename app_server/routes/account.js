const express = require('express');
const router = express.Router();
const ctrlAcc =  require('../controllers/account');

// extrae las contraseñas de un usuario
router.get('/',ctrlAcc.recover);
router.get('/deleteAcc',ctrlAcc.recover);
router.get('/:email',ctrlAcc.InfoCuenta);
module.exports = router;