const authDao = require('../daos/authDao');
const jwt = require('jsonwebtoken');
const AppError = require('.././utils/appError');
const {sendEmail} = require('../utils/email');
const crypto = require('crypto');
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

const signup = async (reqBody, res) => {

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
        throw new AppError('Incorrect email or password', 401);
    };

    const token = generateToken(user._id, res);

    return token;

};

const logout = async () => {
    //not needed for now
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

const resetPassword = async (req, res) => {

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

    const token = generateToken(user._id, res);

    return token;
};

const updatePassword = async (req, res) => {

    const user = await authDao.updatePassword(req.user.id);

    if(!(await user.correctPassword(req.body.passwordCurrent, user.password))){
        throw new AppError('Your current password is wrong!', 401);
    };

    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    await user.save();

    const token = generateToken(user._id, res);

    return token;

};

module.exports = {
    signup,
    login,
    logout,
    forgotPassword,
    resetPassword,
    updatePassword
}