const mongoose = require('mongoose');
mongoose.Promise = Promise;

const Topics = require('../models/topics');
const Articles = require('../models/articles');
const Comments = require('../models/comments');

function getAllTopics(req, res, next) {
  Topics.find()
    .then(topics => res.json({ topics }))
    .catch(next);
}

function getAllArticlesByTopic(req, res, next) {
  const { slug } = req.params;
  let page = +req.query.page || 0;
  let limit = +req.query.limit || 10;
  let sort = req.query.sort || null;

  // Invalid input - page number
  if (req.query.page && !/^\d+$/.test(req.query.page)) {
    const err = new Error('Invalid page number. Page must be queried with a valid number.');
    err.status = 400;
    return next(err);
  }

  // Invalid input - limit number
  if (req.query.limit && !/^\d+$/.test(req.query.limit)) {
    const err = new Error('Invalid limit. Limit must be queried with a valid number.');
    err.status = 400;
    return next(err);
  }

  // Invalid input - sort
  if (req.query.sort) {
    const key = req.query.sort.match(/\w+/g)[0];
    if (!['votes', 'comments', '_id'].includes(key)) {
      const err = new Error('Invalid sort query. Sort must be queried with a valid term; votes, comments, _id.');
      err.status = 400;
      return next(err);
    }
  }

  let articles;
  Topics.find()
    .then(topics => topics.map(topic => topic.slug))
    .then(topicSlugs => {
      if (!topicSlugs.includes(slug)) {
        const err = new Error('Invalid topic slug.');
        err.status = 400;
        return next(err);
      }
    })
    .then(() => {
      return Articles.find({ belongs_to: req.params.slug }).sort(sort).skip(page * limit).limit(limit).lean()
    })
    .then(articlesResponse => {
      articles = articlesResponse;
      const promises = articles.map(article => Comments.find({ belongs_to: article._id }).lean())
      return Promise.all(promises);
    })
    .then(comments => {
      comments.forEach((comment, i) => articles[i].comments = comment.length);
    })
    .then(() => res.json({ page, limit, length: articles.length, sort, topic: req.params.slug, articles }))
    .catch(next);
}

module.exports = { getAllTopics, getAllArticlesByTopic }