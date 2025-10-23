const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('../models/user');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const protect = catchAsync(async (req, res, next) => {
  let token;
  // 1) Getting token and checking if it's there

  if (req.cookies && req.cookies.jwt) {
    token = req.cookies.jwt;
  } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    [, token] = req.headers.authorization.split(' ');
  }

  if (!token || token === '') {
    throw new AppError('Você não está autenticado! Por favor acesse sua conta.', 401);
  }

  // 2) Verification token
  // Verifys if the token has not been tempered with
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // In case of an error, the global error handling middleware
  // has 2 functions that deal with an expired and an invalid token.

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded._id);
  if (!currentUser) {
    throw new AppError('O usuário que pertence a este token não existe mais', 401);
  }

  // Attach the authenticated user to the request object for access in later middlewares/controllers
  req.user = currentUser;
  next();
});

module.exports = {
  protect
};
