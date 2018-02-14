const mongoose = require('mongoose');
mongoose.Promise = Promise;
const ObjectId = require('mongoose').Types.ObjectId;

const Comments = require('../models/comments');

function voteOnComment (req, res, next) {
  const { vote } = req.query;
  const { comment_id } = req.params;

  // Invalid comment id
  if (!ObjectId.isValid(comment_id)) {
    const err = new Error('Invalid comment id.');
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
  Comments.findByIdAndUpdate({ _id: comment_id }, { $inc: { votes: num } }, { new: true })
    .then(comment => res.json({ vote: req.query.vote, comment }))
    .catch(next);
}

function deleteComment (req, res, next) {
  const { comment_id } = req.params;

  // Invalid comment id
  if (!ObjectId.isValid(comment_id)) {
    const err = new Error('Invalid comment id.');
    err.status = 400;
    return next(err);
  }

  Comments.deleteOne({ _id: comment_id })
    .then(() => res.status(204).json())
    .catch(next);
}

module.exports = { voteOnComment, deleteComment };