const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const protectRoutesMiddleware = require('../middlewares/protectRoutesMiddleware');

router.use(protectRoutesMiddleware.protect);

router.route('/create').post(cartController.createCart);
router.route('/get').get(cartController.getCart);
router.route('/addOrEditItem').patch(cartController.addOrEditItem);
router.route('/deleteItem').delete(cartController.deleteItem);

module.exports = router;
