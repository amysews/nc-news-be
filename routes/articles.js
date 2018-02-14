const express = require('express');
const articlesRouter = express.Router();

const { getAllArticles, getOneArticle, getAllCommentsByArticle, postCommentToArticle, voteOnArticle } =  require('../controllers/articles');

articlesRouter.get('/', getAllArticles);
articlesRouter.get('/:article_id', getOneArticle);
articlesRouter.get('/:article_id/comments', getAllCommentsByArticle);

articlesRouter.post('/:article_id/comments', postCommentToArticle);

articlesRouter.put('/:article_id', voteOnArticle);

module.exports = articlesRouter;