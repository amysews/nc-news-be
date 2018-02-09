const mongoose = require('mongoose');
mongoose.Promise = Promise;

const Topics = require('../models/topics');

function getAllTopics (req, res, next) {
  Topics.find()
    .then(topics => res.json({ topics }))
    .catch(next);
}

module.exports = { getAllTopics }