const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const protectRoutesMiddleware = require('../middlewares/protectRoutesMiddleware');
const restrictRouteMiddleware = require('../middlewares/restrictRoutesMiddleware');

//user registering/login and getting his JWT token
router.post('/signup', authController.signup);
router.post('/login', authController.login);

//user not logged in
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

//user logged in
router.patch('/updateMyPassword',protectRoutesMiddleware.protect, authController.updatePassword);
router.patch('/updateMe', protectRoutesMiddleware.protect, userController.updateUserByUser);

//admin CRUD operations regarding Users
router.route('/')
    .get(protectRoutesMiddleware.protect,restrictRouteMiddleware.restrictTo('admin'), userController.findAll)
    .post(protectRoutesMiddleware.protect,restrictRouteMiddleware.restrictTo('admin'), userController.createOne);

router.route('/:id')
    .get(protectRoutesMiddleware.protect,restrictRouteMiddleware.restrictTo('admin'), userController.findOne)
    .patch(protectRoutesMiddleware.protect,restrictRouteMiddleware.restrictTo('admin'), userController.updateUserByAdmin)
    .delete(protectRoutesMiddleware.protect,restrictRouteMiddleware.restrictTo('admin'), userController.deleteOne);

module.exports = router;