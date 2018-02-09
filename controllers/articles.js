const mongoose = require('mongoose');
mongoose.Promise = Promise;

const Articles = require('../models/articles');
const Comments = require('../models/comments');

function getAllArticles(req, res, next) {
  let articles;
  Articles.find().lean()
    .then(articlesResponse => {
      articles = articlesResponse;
      const promises = articles.map(article => Comments.find({ belongs_to: article._id }).lean())
      return Promise.all(promises)
    })
    .then(comments => {
      comments.forEach((comment, i) => articles[i].comments = comment.length)
    })
    .then(() => res.json({ topic: req.params.slug, articles }))
    .catch(next);
}

function getOneArticle(req, res, next) {
  let article;
  Articles.findOne({ _id: req.params.article_id }).lean()
    .then(articleResponse => {
      article = articleResponse;
      return Comments.find({ belongs_to: article._id }).lean()
    })
    .then(comments => {
      article.comments = comments.length;
    })
    .then(() => res.json({ article_id: req.params.article_id, article }))
    .catch(next);
}

function getAllCommentByArticle(req, res, next) {
  Comments.find({ belongs_to: req.params.article_id })
    .then(comments => res.json({ article_id: req.params.article_id, comments }))
    .catch(next);
}

function postCommentToArticle(req, res, next) {
  const newComment = new Comments({
    body: req.body.comment,
    belongs_to: req.params.article_id,
    created_by: 'northcoder'
  });
  newComment.save()
    .then(comment => res.json({ article_id: req.params.article_id, comment }))
    .catch(next);
}

function voteOnArticle(req, res, next) {
  const { vote } = req.query;
  let num;
  if (vote === 'up') num = 1;
  if (vote === 'down') num = -1;
  let article;
  Articles.findByIdAndUpdate({ _id: req.params.article_id }, { $inc: { votes: num } }, { new: true }).lean()
    .then(articleResponse => {
      article = articleResponse;
      return Comments.find({ belongs_to: article._id }).lean()
    })
    .then(comments => {
      article.comments = comments.length;
    })
    .then(() => res.json({ vote: req.query.vote, article }))
    .catch(next)
}

module.exports = { getAllArticles, getOneArticle, getAllCommentByArticle, postCommentToArticle, voteOnArticle }