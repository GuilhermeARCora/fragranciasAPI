const express = require('express');

const router = express.Router();
const authController = require('../controllers/authController');
const protectRoutesMiddleware = require('../middlewares/protectRoutesMiddleware');

// user registering/login and getting his JWT token
router.post('/signup', authController.signup);
router.post('/login', authController.login);

// user logged in
router.use(protectRoutesMiddleware.protect);

router.get('/me', authController.me);
router.delete('/logout', authController.logout);

module.exports = router;
