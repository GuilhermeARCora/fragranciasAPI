const express = require('express');

const router = express.Router();
const productController = require('../controllers/productController');
const protectRoutesMiddleware = require('../middlewares/protectRoutesMiddleware');
const restrictRouteMiddleware = require('../middlewares/restrictRoutesMiddleware');
const imageUpload = require('../middlewares/uploadImageMiddleware');

router.route('/').get(productController.findAll);
router.route('/latest').get(productController.newProducts);
router.route('/statistics').get(protectRoutesMiddleware.protect, restrictRouteMiddleware.restrictTo('admin'), productController.findStatistics);
router.route('/category/:category').get(productController.findByCategory);
router.route('/:id').get(productController.findOne);

router.use(protectRoutesMiddleware.protect);
router.use(restrictRouteMiddleware.restrictTo('admin'));

// bucket = "products-images, folder = "products/", fieldName = "image" "
const uploadImage = imageUpload(process.env.PRODUCTS_BUCKET, { folder: 'products/', fieldName: 'image' });

router.post('/', uploadImage, productController.create);

router.route('/:id/status').patch(productController.changeStatus);

router.route('/:id')
  .patch(uploadImage, productController.update)
  .delete(productController.remove);

module.exports = router;
