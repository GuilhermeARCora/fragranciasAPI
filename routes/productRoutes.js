const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const protectRoutesMiddleware = require('../middlewares/protectRoutesMiddleware');
const restrictRouteMiddleware = require('../middlewares/restrictRoutesMiddleware');

router.route('/')
    .get(productController.findAll)
    .post(protectRoutesMiddleware.protect, restrictRouteMiddleware.restrictTo('admin'), productController.createOne);

router.route('/:id')
    .get(productController.findOne)
    .patch(protectRoutesMiddleware.protect, restrictRouteMiddleware.restrictTo('admin'), productController.updatePatch)
    .delete(protectRoutesMiddleware.protect,restrictRouteMiddleware.restrictTo('admin'), productController.deleteOne);

module.exports = router;
