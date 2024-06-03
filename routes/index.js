const express = require('express');
const router = express.Router();
const { verifyToken } = require("../middlewares/verifyJwtToken");

router.use('/user', require('./user'));
router.use('/category', verifyToken, require('./category'));
router.use('/article', verifyToken, require('./article'));

module.exports = router;