const express = require('express');
const router = express.Router();
const categoryController = require("../controllers/category");

router.get('/list', categoryController?.list);

module.exports = router;