const mongoose = require('mongoose');
mongoose.Promise = Promise;

const Users = require('../models/users');
const Comments = require('../models/comments');
const Articles = require('../models/articles');

function getAllUsers (req, res, next) {
  let users;
  Users.find().lean()
    .then(usersResponse => users = usersResponse)
    .then(() => {
      const promiseCommentsCounts = users.map(user => {
        return Comments.count({ created_by: user.username })
      })
      return Promise.all(promiseCommentsCounts);
    })
    .then((commentsCounts) => {
      users.forEach((user, i) => {
        user.commentsCount = commentsCounts[i];
      })
    })
    .then(() => {
      const promiseArticlesCounts = users.map(user => {
        return Articles.count({ created_by: user.username })
      })
      return Promise.all(promiseArticlesCounts);
    })
    .then((articlesCounts) => {
      users.forEach((user, i) => {
        user.articlesCount = articlesCounts[i];
      })
    })
    .then(() => res.json({ users }))
    .catch(next);
}

function getOneUser (req, res, next) {
  Users.findOne({ username: req.params.username })
    .then(user => res.json({ username: req.params.username, user }))
    .catch(next);
}

module.exports = { getAllUsers, getOneUser }