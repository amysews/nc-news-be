const express = require('express');
const router = express.Router();

const topicsRouter = require('./topics');
const articlesRouter = require('./articles');
const commentsRouter = require('./comments');

router.use('/topics', topicsRouter);
router.use('/articles', articlesRouter);
router.use('/comments', commentsRouter);

module.exports = router;