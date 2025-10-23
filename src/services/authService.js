const authDao = require('../daos/authDao');
const AppError = require('../utils/appError');
const filterFields = require('../utils/filterFields');
const User = require('../models/user');

const signup = async (reqBody) => {
  // Prevent injecting restricted fields like 'role' by explicitly selecting allowed attributes
  const safeData = filterFields(reqBody, 'name', 'password', 'email', 'confirmPassword', 'confirmEmail');

  // full user instance (to trigger virtual validation)
  const user = new User(safeData);

  // Trigger validation manually
  await user.validate(); // this will throw if confirm fields are wrong

  const createdUser = await authDao.signup(user);

  if (!createdUser) throw new AppError('Falha ao criar o usuário. Tente novamente mais tarde.', 500);

  createdUser.password = undefined;

  return createdUser;
};

const login = async (reqBody) => {
  const email = reqBody.email.toLowerCase().trim();
  const { password } = reqBody;

  if (!email || !password) throw new AppError('Por favor insira email ou senha!', 400);

  // Retrieve user from database by email (also includes password with .select('+password'))
  const user = await authDao.login(email);

  if (!user || !(await user.correctPassword(password, user.password))) throw new AppError('Email ou senha inválidos', 401);

  return user;
};

module.exports = {
  signup,
  login
};
