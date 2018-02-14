if (!process.env.NODE_ENV) process.env.NODE_ENV = 'dev';

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const router = require('./routes');
const config = require('./config');
const morgan = require('morgan');
const cors = require('cors');
const db = config.DB[process.env.NODE_ENV] || process.env.DB;
mongoose.Promise = Promise;

mongoose.connect(db, { useMongoClient: true })
  .then(() => console.log('successfully connected to', db))
  .catch(err => console.log('connection failed', err));

app.use(cors());
app.use(bodyParser.json());
app.use(morgan('dev'));

app.use('/api', router);

app.use(function (err, req, res) {
  res.status(err.status || 500);
  res.json({
    error: {
      status: err.status,
      message: err.message
    }
  });
});

module.exports = app;
