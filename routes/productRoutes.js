const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const protectRoutesMiddleware = require('../middlewares/protectRoutesMiddleware');
const restrictRouteMiddleware = require('../middlewares/restrictRoutesMiddleware');
const imageUpload = require('../middlewares/uploadImageMiddleware');


router.route('/').get(productController.getAllProducts);
router.route('/novidades').get(productController.getNovidades);
router.route('/searchAutoComplete').get(productController.searchAutoComplete);
router.route('/productsByCategory').get(productController.getProductsByCategory);
router.route('/:id').get(productController.getOneProduct);

router.use(protectRoutesMiddleware.protect);
router.use(restrictRouteMiddleware.restrictTo('admin'));

// bucket = "products-images, folder = "products/", fieldName = "image" "
const uploadImage = imageUpload('products-images', { folder: 'products/', fieldName: 'image' });

router.post('/', uploadImage, productController.createOneProduct);

router.route('/changeStatus/:id').patch(productController.changeStatus);

router.route('/:id')
    .patch(uploadImage ,productController.editOneProduct)
    .delete(productController.deleteOneProduct);

module.exports = router;
