const express = require('express');

const router = express.Router();
const productRouter = require('./productRoutes');
const userRouter = require('./userRoutes');
const orderRouter = require('./orderRoutes');
const keepAliveRouter = require('../keepAlive/keepAliveJob');
const AppError = require('../utils/appError');

// main file for routes! Making the specic routing files thinner,
// and effortlessly spotting all main endpoints in the API.
router.use('/orders', orderRouter);
router.use('/users', userRouter);
router.use('/products', productRouter);
router.use('/keep-alive', keepAliveRouter);

// Handles unexisting routes
router.all('*', (req, res, next) => {
  next(new AppError(`Não foi possível encontrar ${req.originalUrl} nesse servidor!`, 404));
});

module.exports = router;
