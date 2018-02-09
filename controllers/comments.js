const mongoose = require('mongoose');
mongoose.Promise = Promise;

const Comments = require('../models/comments');

function voteOnComment (req, res, next) {
  const { vote } = req.query;
  let num;
  if (vote === 'up') num = 1;
  if (vote === 'down') num = -1;
  Comments.findByIdAndUpdate({ _id: req.params.comment_id }, { $inc: { votes: num } }, { new: true })
    .then(comment => res.json({ vote: req.query.vote, comment }))
    .catch(next)
}

module.exports = { voteOnComment };