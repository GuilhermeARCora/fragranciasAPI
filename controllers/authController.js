const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const authService = require('../services/authService');
const sendResponse = require('../utils/sendResponse');

const generateToken = (userId, res) => {
  const token = jwt.sign({ _id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });

  const cookieOptions = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'Strict' : 'Lax'
  };

  res.cookie('jwt', token, cookieOptions);

  return token;
};

const signup = catchAsync(async (req, res, next) => {
  const user = await authService.signup(req.body);
  const token = generateToken(user._id, res);

  sendResponse(res, 201, 'Cadastrado com sucesso', {
    token,
    user
  });
});

const login = catchAsync(async (req, res, next) => {
  const user = await authService.login(req.body, res);

  const token = generateToken(user._id, res);

  sendResponse(res, 200, 'Conectado com sucesso', token);
});

const logout = (req, res, next) => {
  // Overwrites the existing cookie
  res.cookie('jwt', '', {
    expires: new Date(Date.now() + 10 * 1000), // expires in 10s
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'Strict' : 'Lax'
  });

  sendResponse(res, 200, 'Desconectado com sucesso!', {});
};

const me = (req, res) => {
  const user = req.user.toObject();

  sendResponse(res, 200, 'sucess', user);
};

module.exports = {
  signup,
  login,
  logout,
  me
};
