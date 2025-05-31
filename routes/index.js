const express = require('express');
const router = express.Router();
const productRouter = require('./productRoutes');
const userRouter = require('./userRoutes');
const AppError = require('../utils/appError');

router.use('/products', productRouter);
router.use('/users', userRouter);

router.all('*',(req,res,next)=>{
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

module.exports = router;
