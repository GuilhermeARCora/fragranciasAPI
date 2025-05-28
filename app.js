const express = require('express');
const morgan = require('morgan');

const app = express();

const apiRouter = require('./routes/index');

// 1) MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use('/api/v1', apiRouter);



module.exports = app;
