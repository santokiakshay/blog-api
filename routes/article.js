const express = require('express');
const router = express.Router();
const articleController = require("../controllers/article");

router.get('/', articleController?.list);
router.get('/paginate', articleController?.paginate);
router.get('/:id', articleController?.getById);
router.post('/', articleController?.create);
router.put('/:id', articleController?.update);
router.delete('/:id', articleController?.destroy);

module.exports = router;