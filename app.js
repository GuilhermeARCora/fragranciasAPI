const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const app = express();

const globalErrorHandler = require('./controllers/errorController');
const apiRouter = require('./routes/index');

// Set Security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//Limits reqs from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60* 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!'
});

app.use('/api', limiter);

// Body parser, reading data from body into req.body and limiting the amount of data coming.
app.use(express.json({limit: '10kb' }));

// Routes
app.use('/api/v1', apiRouter);

app.use(globalErrorHandler);

module.exports = app;
