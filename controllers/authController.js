const catchAsync = require('../utils/catchAsync');
const authService = require('../services/authService');

const signup = catchAsync(async (req,res,next) => {
    
    const {user, token} = await authService.signup(req.body);

    res.status(201).json({
        status:"success",
        token,
        data:{
            user
        }
    });

});

const login = catchAsync(async (req,res,next) => {

    const token = await authService.login(req.body);

    res.status(200).json({
        status:"success",
        token
    });

});

const forgotPassword = catchAsync(async (req,res,next) => {

   const emailSent = await authService.forgotPassword(req);

        res.status(200).json({
            status: 'success',
            message:'Token sent to email'
        });

});

const resetPassword = catchAsync(async (req,res,next) => {

    const token = await authService.resetPassword(req);

    res.status(200).json({
        status:"success",
        token
    });

});

const updatePassword = catchAsync(async (req,res,next) => {

    const token = await authService.updatePassword(req);

     res.status(200).json({
        status:"success",
        token
    });

});

module.exports = {
    signup,
    login,
    forgotPassword,
    resetPassword,
    updatePassword
};