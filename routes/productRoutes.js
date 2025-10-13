const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const protectRoutesMiddleware = require('../middlewares/protectRoutesMiddleware');
const restrictRouteMiddleware = require('../middlewares/restrictRoutesMiddleware');
const imageUpload = require('../middlewares/uploadImageMiddleware');
const rateLimit = require('express-rate-limit');

const searchLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 500,
  message: 'Too many search requests, please slow down.'
});

router.route('/').get(productController.findAll);
router.route('/novidades').get(productController.newProducts);
router.route('/searchAutoComplete').get(searchLimiter, productController.searchAutoComplete);
router.route('/category/:category').get(productController.findByCategory);
router.route('/:id').get(productController.findOne);

router.use(protectRoutesMiddleware.protect);
router.use(restrictRouteMiddleware.restrictTo('admin'));

// bucket = "products-images, folder = "products/", fieldName = "image" "
const uploadImage = imageUpload('products-images', { folder: 'products/', fieldName: 'image' });

router.post('/', uploadImage, productController.create);

router.route('/:id/status').patch(productController.changeStatus);

router.route('/:id')
    .patch(uploadImage ,productController.update)
    .delete(productController.remove);

module.exports = router;
