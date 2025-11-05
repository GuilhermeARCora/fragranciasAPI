const express = require('express');

const router = express.Router();
const productRouter = require('./productRoutes');
const authRoutes = require('./authRoutes');
const orderRouter = require('./orderRoutes');
const keepAliveRouter = require('../keepAlive/keepAliveJob');
const AppError = require('../utils/appError');

router.use('/orders', orderRouter);
router.use('/auth', authRoutes);
router.use('/products', productRouter);
router.use('/keep-alive', keepAliveRouter);

router.all('*', (req, res, next) => {
  next(new AppError(`Não foi possível encontrar ${req.originalUrl} nesse servidor!`, 404));
});

module.exports = router;
