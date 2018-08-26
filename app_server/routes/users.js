const express = require('express');
const router = express.Router();
const ctrlUsers = require('../controllers/users');

/* GET users listing. */
router.put('/users',ctrlUsers.editUser);
router.put('/',ctrlUsers.nuevaPass);
router.get('/users',ctrlUsers.getUsers);
router.get('/',ctrlUsers.getUser);
router.post('/recover',ctrlUsers.recoverPass);
router.post('/',ctrlUsers.postUsers);
router.get('/deleteUser',ctrlUsers.deleteUser);

module.exports = router;
