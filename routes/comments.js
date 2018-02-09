const express = require('express');
const commentsRouter = express.Router();

const { voteOnComment, deleteComment } = require('../controllers/comments');

commentsRouter.put('/:comment_id', voteOnComment);

commentsRouter.delete('/:comment_id', deleteComment);

module.exports = commentsRouter;