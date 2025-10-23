require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { setupSwagger } = require('./swagger.config');

const app = express();

const globalErrorHandler = require('../src/controllers/errorController');
const apiRouter = require('../src/routes/index');

app.set('trust proxy', 1);

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Set Security HTTP headers
app.use(helmet());

const allowedOrigin = process.env.NODE_ENV === 'production' ? process.env.FRONTEND_URL : process.env.FRONTEND_DEV_URL;

// Enable CORS with credentials support (for cross-origin cookies)
app.use(cors({
  origin: allowedOrigin,
  credentials: true
}));

// Enable detailed request logging in development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body parser, reading data from body into req.body and limiting the amount of data coming.
app.use(express.json({ limit: '10kb' }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS, html malicious code
app.use(xss());

// Prevent parameter pollution, does not allow duplicate params in querys,
// but its possible to whitelist spcific ones.
app.use(hpp({
  // whitelist: ['']
}));

app.use(cookieParser());

// Limits reqs from same IP
const limiter = rateLimit({
  max: process.env.NODE_ENV === 'development' ? 1000 : 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!'
});

setupSwagger(app);

app.use('/api', limiter);

// Routes
app.use('/api/v1', apiRouter);

app.use('/keep-alive', require('../src/keepAlive/keepAliveJob'));

app.use(globalErrorHandler);

module.exports = app;
