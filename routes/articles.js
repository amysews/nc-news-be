const express = require('express')
const articlesRouter = express.Router()

const { getAllArticles, getOneArticle } =  require('../controllers/articles');

articlesRouter.get('/', getAllArticles);
articlesRouter.get('/:article_id', getOneArticle)

module.exports = articlesRouter;