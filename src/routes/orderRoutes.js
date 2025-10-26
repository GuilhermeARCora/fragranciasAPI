const express = require('express');

const router = express.Router();
const orderController = require('../controllers/orderController');
const protectRoutesMiddleware = require('../middlewares/protectRoutesMiddleware');
const restrictRouteMiddleware = require('../middlewares/restrictRoutesMiddleware');

router.route('/').post(orderController.create);
router.route('/statistics')
  .get(protectRoutesMiddleware.protect, restrictRouteMiddleware.restrictTo('admin'), orderController.findStatistics);
router.route('/ordersEvolution')
  .get(protectRoutesMiddleware.protect, restrictRouteMiddleware.restrictTo('admin'), orderController.findOrdersEvolution);
router.route('/:id').get(orderController.findOne);

router.use(protectRoutesMiddleware.protect);
router.use(restrictRouteMiddleware.restrictTo('admin'));

router.route('/').get(orderController.findAll);
router.route('/:id/status').patch(orderController.update);

module.exports = router;
