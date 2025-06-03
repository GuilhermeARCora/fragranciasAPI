const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const protectRoutesMiddleware = require('../middlewares/protectRoutesMiddleware');

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
router.patch('/updateMyPassword',protectRoutesMiddleware.protect, authController.updatePassword);

router.route('/').get(userController.findAll).post(userController.createOne);
router.route('/:id').get(userController.findOne).patch(userController.updatePatch).delete(userController.deleteOne);

module.exports = router;