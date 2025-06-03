const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.post('/forgotPassword', authController.forgotPassword);
router.post('/resetPassword', authController.resetPassword);

router.route('/').get(userController.findAll).post(userController.createOne);
router.route('/:id').get(userController.findOne).patch(userController.updatePatch).delete(userController.deleteOne);

module.exports = router;