const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

router.post('/signup', authController.signup);

router.route('/').get(userController.findAll).post(userController.createOne);
router.route('/:id').get(userController.findOne).patch(userController.updatePatch).delete(userController.deleteOne);

module.exports = router;