const authDao = require('./auth.dao');
const AppError = require('../../core/utils/appError');
const filterFields = require('../../core/utils/filterFields');
const User = require('./user.model');

const signup = async (reqBody) => {
  const safeData = filterFields(reqBody, 'name', 'password', 'email', 'confirmPassword', 'confirmEmail');

  if (Object.keys(safeData).length === 0) throw new AppError('Os dados passados são inválidos!', 400);

  // full user instance (to trigger virtual validation)
  const user = new User(safeData);

  // Trigger validation manually
  await user.validate(); // this will throw if confirm fields are wrong

  const createdUser = await authDao.signup(user);

  createdUser.password = undefined;

  return createdUser;
};

const login = async (reqBody) => {
  const email = reqBody.email.toLowerCase().trim();
  const { password } = reqBody;

  if (!email || !password) throw new AppError('Por favor insira email ou senha!', 400);

  // Retrieve user from database by email (also includes password with .select('+password'))
  const user = await authDao.login(email);

  if (!user) throw new AppError('Usuário não encontrado', 404);

  if (!(await user.correctPassword(password, user.password))) throw new AppError('Email ou senha inválidos', 401);

  return user;
};

module.exports = {
  signup,
  login
};
