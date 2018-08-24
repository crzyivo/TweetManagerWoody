const express = require('express');
const router = express.Router();
const ctrlAcc =  require('../controllers/account');

// extrae las contraseñas de un usuario
router.get('/',ctrlAcc.recover);
router.put('/deleteAcc',ctrlAcc.deleteAcc);
router.put('/insertAcc',ctrlAcc.postAcc);
router.get('/show/:user',ctrlAcc.TWPrueba);
router.get('/show/callback/:id',ctrlAcc.TWPrueba2);
router.get('/:email/:user',ctrlAcc.getAcc);
module.exports = router;