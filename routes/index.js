const express = require('express');
const router = express.Router();
const productRouter = require('./productRoutes');
const userRouter = require('./userRoutes');


router.use('/products', productRouter);
router.use('/users', userRouter);

router.all('*',(req,res)=>{
  
  res.status(404).json({
    status: "fail",
    message: `Can't find ${req.originalUrl} on this server!`
  });
});

module.exports = router;
