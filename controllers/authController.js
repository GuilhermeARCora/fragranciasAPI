const catchAsync = require('../utils/catchAsync');
const authService = require('../services/authService');

const signup = catchAsync(async (req,res,next) => {
    
    const {user, token} = await authService.signup(req.body, res);

    res.status(201).json({
        status:"success",
        token,
        data:{
            user
        }
    });

});

const login = catchAsync(async (req,res,next) => {

    const token = await authService.login(req.body, res);

    res.status(200).json({
        status:"success",
        token
    });

});

const logout = (req,res,next) => {

    // Overwrites the existing cookie
    res.cookie('jwt', '', {
        expires: new Date(Date.now() + 10 * 1000), // expires in 10s
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict'
    });

    res.status(200).json({
        status: 'success',
        message: 'Logged out successfully'
    });

};

const forgotPassword = catchAsync(async (req,res,next) => {

   const emailSent = await authService.forgotPassword(req);

        res.status(200).json({
            status: 'success',
            message:'Token sent to email'
        });

});

const resetPassword = catchAsync(async (req,res,next) => {

    const token = await authService.resetPassword(req, res);

    res.status(200).json({
        status:"success",
        token
    });

});

const updatePassword = catchAsync(async (req,res,next) => {

    const token = await authService.updatePassword(req, res);

     res.status(200).json({
        status:"success",
        token
    });

});

module.exports = {
    signup,
    login,
    logout,
    forgotPassword,
    resetPassword,
    updatePassword
};