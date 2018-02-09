const express = require('express')
const articlesRouter = express.Router()

const { getAllArticles, getOneArticle, getAllCommentByArticle } =  require('../controllers/articles');

articlesRouter.get('/', getAllArticles);
articlesRouter.get('/:article_id', getOneArticle);
articlesRouter.get('/:article_id/comments', getAllCommentByArticle)

module.exports = articlesRouter;