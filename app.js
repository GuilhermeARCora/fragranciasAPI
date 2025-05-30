const express = require('express');
const morgan = require('morgan');
const { swaggerUi, swaggerSpec } = require('./swagger');

const app = express();

const apiRouter = require('./routes/index');

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use('/api/v1', apiRouter);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

module.exports = app;
