const authDao = require('../daos/authDao');
const jwt = require('jsonwebtoken');
const AppError = require('.././utils/appError');
const filterFields = require('../utils/filterFields');
const User = require('../models/user');

const generateToken = (userId, res) => {

    const token = jwt.sign({ _id: userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });

    const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? "Strict" : "Lax"
    };

    res.cookie('jwt', token, cookieOptions);

  return token; 
};

const signup = async (reqBody, res,req) => {

    // Prevent users from injecting restricted fields like 'role' by explicitly selecting allowed attributes
    const safeData = filterFields(reqBody, 'name', 'password', 'email', 'confirmPassword', 'confirmEmail');

    //full user instance (to trigger virtual validation)
    const user = new User(safeData);

    //Trigger validation manually
    await user.validate(); // this will throw if confirm fields are wrong

    const createdUser = await authDao.signup(user);

    createdUser.password = undefined;

    const token = generateToken(createdUser._id, res);

    return {
        user: createdUser,
        token
    };
};

const login = async (reqBody, res) => {

    const email = reqBody.email.toLowerCase().trim();
    const password = reqBody.password;

    if(!email || !password){
       throw new AppError(`Please provide email and password!`, 400);
    };

    // Retrieve user from database by email (also includes password with .select('+password'))
    const user = await authDao.login(email);

    if(!user || !(await user.correctPassword(password, user.password))){
        throw new AppError('Email ou senha inválidos', 401);
    };

    const token = generateToken(user._id, res);

    return token;

};

const logout = async () => {
    //not needed for now
};

module.exports = {
    signup,
    login,
    logout
};