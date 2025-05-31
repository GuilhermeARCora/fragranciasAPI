const express = require('express');
const morgan = require('morgan');

const app = express();

const apiRouter = require('./routes/index');

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());

app.use('/api/v1', apiRouter);

module.exports = app;
