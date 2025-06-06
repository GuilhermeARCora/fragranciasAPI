const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const protectRoutesMiddleware = require('../middlewares/protectRoutesMiddleware');
const restrictRouteMiddleware = require('../middlewares/restrictRoutesMiddleware');
const uploadPhoto = require('../middlewares/uploadPhotoMiddleware');

router.route('/')
    .get(productController.findAll)
    .post(protectRoutesMiddleware.protect,uploadPhoto('products', 'product'), restrictRouteMiddleware.restrictTo('admin'), productController.createOne);

router.route('/:id')
    .get(productController.findOne)
    .patch(protectRoutesMiddleware.protect, uploadPhoto('products', 'product'), restrictRouteMiddleware.restrictTo('admin'), productController.updatePatch)
    .delete(protectRoutesMiddleware.protect,restrictRouteMiddleware.restrictTo('admin'), productController.deleteOne);

module.exports = router;
