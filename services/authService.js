const authDao = require('../daos/authDao');
const jwt = require('jsonwebtoken');
const AppError = require('.././utils/appError');
const {sendEmail} = require('../utils/email');
const crypto = require('crypto');

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

const forgotPassword = async (req) => {

    const email = req.body.email;
    const user = await authDao.forgotPassword(email);

    if(!user){
        throw new AppError('There is no user with this email address.', 404);
    }

    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`

    const message = `Forgot your password? Submit a patch request with your new password and passwordConfirm to: ${resetURL}\n
    If you didn't forget your password, ignore this email!`

    const emailSent = await sendEmail({
        email: user.email,
        subject:'Your reset token (Valid for 10 min)',
        message
    });

    try{

       return emailSent;

    }catch(err){

        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });
        throw new AppError('There was an error sending the email, try again later!', 500);
    };

};

const resetPassword = async (req) => {

    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await authDao.resetPassword(hashedToken);

    if(!user){
        throw new AppError('Token is invalid or has expired', 400);
    };

    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    user.passwordResetExpires = undefined;
    user.passwordResetToken = undefined;
    await user.save();

    const token = generateToken(user.id);

    return token;
};

const updatePassword = async (req) => {

    const user = await authDao.updatePassword(req.user.id);

    if(!(await user.correctPassword(req.body.passwordCurrent, user.password))){
        throw new AppError('Your current password is wrong!', 401);
    };

    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    await user.save();

    const token = generateToken(user.id);

    return token;

};

module.exports = {
    signup,
    login,
    forgotPassword,
    resetPassword,
    updatePassword
}