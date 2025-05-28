const app = require('../app');
const express = require('express');
const router = express.Router();
const productRouter = require('./productRoutes');

router.use('/products', productRouter);



module.exports = router;
