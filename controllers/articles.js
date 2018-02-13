const mongoose = require('mongoose');
mongoose.Promise = Promise;
const ObjectId = require('mongoose').Types.ObjectId;

const Articles = require('../models/articles');
const Comments = require('../models/comments');

function getAllArticles(req, res, next) {
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
  Articles.find().sort(sort).skip(page * limit).limit(limit).lean()
    .then(articlesResponse => {
      articles = articlesResponse;
      const promises = articles.map(article => Comments.find({ belongs_to: article._id }).lean())
      return Promise.all(promises)
    })
    .then(comments => {
      comments.forEach((comment, i) => articles[i].comments = comment.length)
    })
    .then(() => res.json({ page, limit, length: articles.length, sort, topic: req.params.slug, articles }))
    .catch(next);
}

function getOneArticle(req, res, next) {
  const { article_id } = req.params;

  // Invalid article id
  if (!ObjectId.isValid(article_id)) {
    const err = new Error('Invalid article id.');
    err.status = 400;
    return next(err);
  }

  let article;
  Articles.findOne({ _id: article_id }).lean()
    .then(articleResponse => {
      article = articleResponse;
      return Comments.find({ belongs_to: article._id }).lean()
    })
    .then(comments => {
      article.comments = comments.length;
    })
    .then(() => res.json({ article_id, article }))
    .catch(next);
}

function getAllCommentsByArticle(req, res, next) {
  const { article_id } = req.params;
  let sort = req.query.sort || null;

  // Invalid article id
  if (!ObjectId.isValid(article_id)) {
    const err = new Error('Invalid article id.');
    err.status = 400;
    return next(err);
  }

  // Invalid input - sort
  if (req.query.sort) {
    const key = req.query.sort.match(/\w+/g)[0];
    if (!['votes', '_id'].includes(key)) {
      const err = new Error('Invalid sort query. Sort must be queried with a valid term; votes, _id.');
      err.status = 400;
      return next(err);
    }
  }

  Comments.find({ belongs_to: req.params.article_id }).sort(sort)
    .then(comments => {
      return res.json({ article_id: req.params.article_id, sort, comments })
    })
    .catch(next);
}

function postCommentToArticle(req, res, next) {
  const { comment } = req.body;
  const { article_id } = req.params;

  // Missing comment body
  if (!comment) {
    const err = new Error('No comment body provided.');
    err.status = 400;
    return next(err);
  }

  // Invalid article id
  if (!ObjectId.isValid(article_id)) {
    const err = new Error('Invalid article id.');
    err.status = 400;
    return next(err);
  }

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
  const { article_id } = req.params;

  // Invalid article id
  if (!ObjectId.isValid(article_id)) {
    const err = new Error('Invalid article id.');
    err.status = 400;
    return next(err);
  }

  // Invalid vote query
  if (!vote || !['up', 'down'].includes(vote)) {
    const err = new Error('Invalid vote query. Must be of the form vote=up or vote=down.');
    err.status = 400;
    return next(err);
  }

  let num;
  if (vote === 'up') num = 1;
  if (vote === 'down') num = -1;
  let article;
  Articles.findByIdAndUpdate({ _id: article_id }, { $inc: { votes: num } }, { new: true }).lean()
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

module.exports = { getAllArticles, getOneArticle, getAllCommentsByArticle, postCommentToArticle, voteOnArticle }