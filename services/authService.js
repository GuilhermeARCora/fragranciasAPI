const authDao = require('../daos/authDao');
const jwt = require('jsonwebtoken');
const AppError = require('.././utils/appError');

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const signup = async (reqBody) => {

    // Prevent users from injecting restricted fields like 'role' by explicitly selecting allowed attributes
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

    const {email, password} = reqBody;

    if(!email || !password){
       throw new AppError(`Please provide email and password!`, 400);
    };

    // Retrieve user from database by email (also includes password with .select('+password'))
    const user = await authDao.login(email);

    if(!user || !(await user.correctPassword(password, user.password))){
        throw new AppError('Incorrect email or password', 401);
    };

    const token = generateToken(user._id);

    return token;

};

const forgotPassword = async (reqBody) => {

    const email = reqBody.email;
    const user = await authDao.forgotPassword(email);

    if(!user){
        throw new AppError('There is no user with this email address.', 404);
    }

    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    return{
        resetToken
    };
};

const resetPassword = () =>{

};

module.exports = {
    signup,
    login,
    forgotPassword,
    resetPassword
}