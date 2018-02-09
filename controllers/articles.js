const mongoose = require('mongoose');
mongoose.Promise = Promise;

const Articles = require('../models/articles');
const Comments = require('../models/comments');

function getAllArticles (req, res, next) {
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

function getOneArticle (req, res, next) {
  Articles.findOne({ _id: req.params.article_id })
    .then(article => res.json({ article_id: req.params.article_id, article }))
    .catch(next);
}

module.exports = { getAllArticles, getOneArticle }