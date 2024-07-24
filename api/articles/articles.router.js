const express = require("express");
const articlesController = require("./articles.controller");
const router = express.Router();
const authMiddleware = require('../../middlewares/auth');

router.post('/', authMiddleware, articlesController.create);
router.put('/:id', authMiddleware, articlesController.update);
router.delete('/:id', authMiddleware, articlesController.delete);

module.exports = router;
