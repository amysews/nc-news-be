const express = require('express')
const usersRouter = express.Router()

const { getAllUsers, getOneUser } = require('../controllers/users');

usersRouter.get('/', getAllUsers);
usersRouter.get('/:username', getOneUser);

module.exports = usersRouter;
