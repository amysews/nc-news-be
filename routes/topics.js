const express = require('express')
const topicsRouter = express.Router()

const { getAllTopics, getAllArticlesByTopic } = require('../controllers/topics');

topicsRouter.get('/', getAllTopics);
topicsRouter.get('/:slug/articles', getAllArticlesByTopic)

module.exports = topicsRouter;
