const mongoose = require('mongoose');
mongoose.Promise = Promise;

const Users = require('../models/users');

function getAllUsers (req, res, next) {
  Users.find()
    .then(users => res.json({ users }))
    .catch(next);
}

module.exports = { getAllUsers }