const express = require('express');
const router = express.Router();
const ctrlUsers = require('../controllers/users');

/* GET users listing. */
router.post('/',ctrlUsers.postUsers);
module.exports = router;
