const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const protectRoutesMiddleware = require('../middlewares/protectRoutesMiddleware');
const restrictRouteMiddleware = require('../middlewares/restrictRoutesMiddleware');
const uploadPhoto = require('../middlewares/uploadPhotoMiddleware');

// router.route('/').get(productController.getAllProducts());
// router.route('/:id').get(productController.getOneProduct());

router.use(protectRoutesMiddleware.protect);
router.use(restrictRouteMiddleware.restrictTo('admin'));

router.route('/').post(productController.createOneProduct);
// router.route('/:id').patch(productController.editOneProduct()).delete(productController.deleteOneProduct());

module.exports = router;
