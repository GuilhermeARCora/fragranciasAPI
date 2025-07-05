const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const protectRoutesMiddleware = require('../middlewares/protectRoutesMiddleware');
const restrictRouteMiddleware = require('../middlewares/restrictRoutesMiddleware');
const imageUpload = require('../middlewares/uploadImageMiddleware');


router.route('/').get(productController.getAllProducts);
router.route('/:id').get(productController.getOneProduct);

router.use(protectRoutesMiddleware.protect);
router.use(restrictRouteMiddleware.restrictTo('admin'));

// bucket = "products-images, folder = "products/", fieldName = "image" "
router.route('/')
    .post(...imageUpload('products-images', { folder: 'products/', fieldName: 'image' }),
        productController.createOneProduct
    );
router.route('/:id')
    .patch(...imageUpload('products-images', { folder: 'products/', fieldName: 'image'}),
        productController.editOneProduct
    )
    .delete(productController.deleteOneProduct);

module.exports = router;
