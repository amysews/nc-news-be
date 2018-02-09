const mongoose = require('mongoose');
mongoose.Promise = Promise;

const Topics = require('../models/topics');
const Articles = require('../models/articles');
const Comments = require('../models/comments');

function getAllTopics (req, res, next) {
  Topics.find()
    .then(topics => res.json({ topics }))
    .catch(next);
}

function getAllArticlesByTopic (req, res, next) {
  let articles;
  Articles.find({ belongs_to: req.params.slug }).lean()
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

module.exports = { getAllTopics, getAllArticlesByTopic }