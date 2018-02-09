const mongoose = require('mongoose');
mongoose.Promise = Promise;

const Users = require('../models/users');

function getAllUsers (req, res, next) {
  Users.find()
    .then(users => res.json({ users }))
    .catch(next);
}

function getOneUser (req, res, next) {
  Users.findOne({ username: req.params.username })
    .then(user => res.json({ username: req.params.username, user }))
    .catch(next);
}

module.exports = { getAllUsers, getOneUser }