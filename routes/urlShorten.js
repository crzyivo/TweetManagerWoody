var express = require('express');
const urlController = require('../controller/urlShorten');

var router = express.Router();
/* GET urlShorten listing. */
router.get("/item/:code", urlController.urlGet );
router.get("/item", urlController.urlGetAll );
router.post("/item",urlController.urlPost);

module.exports = router;