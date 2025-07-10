const express = require('express');
const router = express.Router();
const productRouter = require('./productRoutes');
const userRouter = require('./userRoutes');
const cartRouter = require('./cartRoutes');
const AppError = require('../utils/appError');

//main file for routes! Making the specic routing files thinner, and effortlessly spotting all main endpoints in the API.
router.use('/products', productRouter);
router.use('/users', userRouter);
router.use('/cart', cartRouter);

//Handles unexisting routes
router.all('*',(req,res,next)=>{
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

module.exports = router;
