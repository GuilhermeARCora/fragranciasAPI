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
router.use(protectRoutesMiddleware.protect);

router.get('/me', userController.getMe);
router.delete('/logout', authController.logout);
router.patch('/updateMyPassword',authController.updatePassword);
router.patch('/updateMe', userController.updateUserByUser);
router.delete('/deactivateMe', userController.deactivateUserByUser);

//admin ONLY, CRUD operations regarding Users
router.use(restrictRouteMiddleware.restrictTo('admin'));

router.route('/')
    .get(userController.findAll)
    .post(userController.createOne);

router.route('/:id')
    .get(userController.findOne)
    .patch(userController.updateUserByAdmin)
    .delete(userController.deleteOne);

module.exports = router;