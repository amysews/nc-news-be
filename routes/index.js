const express = require('express');
const router = express.Router();

const topicsRouter = require('./topics');

router.use('/topics', topicsRouter);

module.exports = router;