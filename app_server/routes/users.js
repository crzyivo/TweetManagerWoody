const express = require('express');
const router = express.Router();
const ctrlUsers = require('../controllers/users');

/* GET users listing. */
router.get('/deleteUser',ctrlUsers.deleteUser);
router.post('/',ctrlUsers.postUsers);
router.put('/',ctrlUsers.nuevaPass);
module.exports = router;
