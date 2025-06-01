const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.route('/').get(productController.findAll).post(productController.createOne);
router.route('/:id').get(productController.findOne).patch(productController.updatePatch).delete(productController.deleteOne);

module.exports = router;
