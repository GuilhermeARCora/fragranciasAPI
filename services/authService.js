const authDao = require('../daos/authDao');
const jwt = require('jsonwebtoken');
const AppError = require('.././utils/appError');

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const signup = async (reqBody) => {

    const newUser = {
        name: reqBody.name,
        email:reqBody.email,
        password: reqBody.password
    };

    // Set the virtuals manually
    newUser.confirmPassword = reqBody.confirmPassword;
    newUser.confirmEmail = reqBody.confirmEmail;

    const createdUser = await authDao.signup(newUser);

    const token = generateToken(createdUser.id);

    return {
        user: createdUser,
        token
    };
};

const login = async (reqBody) => {

    //extracts the email and password
    const {email, password} = reqBody;

    // Check if both email and password were provided
    if(!email || !password){
       throw new AppError(`Please provide email and password!`, 400);
    };

    // Retrieve user from database by email (also includes password with .select('+password'))
    const user = await authDao.login(email);

    // If user doesn't exist or password is incorrect, throw an error
    if(!user || !(await user.correctPassword(password, user.password))){
        throw new AppError('Incorrect email or password', 401);
    };

    const token = generateToken(user._id);

    return token;

};

module.exports = {
    signup,
    login
}