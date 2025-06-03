const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const protectRoutesMiddleware = require('../middlewares/protectRoutesMiddleware');
const restrictRouteMiddleware = require('../middlewares/restrictRoutesMiddleware');

router.route('/')
    .get(protectRoutesMiddleware.protect, productController.findAll)
    .post(productController.createOne);

router.route('/:id')
    .get(productController.findOne)
    .patch(productController.updatePatch)
    .delete(protectRoutesMiddleware.protect,restrictRouteMiddleware.restrictTo('admin'), productController.deleteOne);

module.exports = router;
