const express = require('express');
const router = express.Router();
const productRouter = require('./productRoutes');
const userRouter = require('./userRoutes');
const orderRouter = require('./orderRoutes');
const AppError = require('../utils/appError');

//main file for routes! Making the specic routing files thinner, and effortlessly spotting all main endpoints in the API.
router.use('/order', orderRouter);
router.use('/user', userRouter);
router.use('/product', productRouter);

//Handles unexisting routes
router.all('*',(req,res,next)=>{
  next(new AppError(`Não foi possível encontrar ${req.originalUrl} nesse servidor!`, 404));
});

module.exports = router;
