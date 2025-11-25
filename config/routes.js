const express = require('express');

const router = express.Router();
const productRouter = require('../src/modules/product/product.routes');
const authRoutes = require('../src/modules/auth/auth.routes');
const orderRouter = require('../src/modules/order/order.routes');
const keepAliveRouter = require('../src/modules/keepAlive/keepAliveJob');
const AppError = require('../src/core/utils/appError');

router.use('/orders', orderRouter);
router.use('/auth', authRoutes);
router.use('/products', productRouter);
router.use('/keep-alive', keepAliveRouter);

router.all('*', (req, res, next) => {
  next(new AppError(`Não foi possível encontrar ${req.originalUrl} nesse servidor!`, 404));
});

module.exports = router;
