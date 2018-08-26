const express = require('express');
const router = express.Router();
const ctrlUsers = require('../controllers/users');

/* GET users listing. */
router.put('/',ctrlUsers.nuevaPass);
router.get('/',ctrlUsers.getUser);
router.get('/users',ctrlUsers.getUsers);
router.post('/',ctrlUsers.postUsers);
router.get('/deleteUser',ctrlUsers.deleteUser);
router.post('/recover',ctrlUsers.recoverPass);

module.exports = router;
