const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const protectRoutesMiddleware = require('../middlewares/protectRoutesMiddleware');

router.use(protectRoutesMiddleware.protect);

router.route('/')
        .post(cartController.createCart)
        // .get(cartController.getCart)
        // .patch(cartController.editCart)

module.exports = router;
