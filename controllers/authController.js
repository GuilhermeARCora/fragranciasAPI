const catchAsync = require('../utils/catchAsync');
const authService = require('../services/authService');
const sendResponse = require('../utils/sendResponse');

const signup = catchAsync(async (req,res,next) => {
    
    const {user, token} = await authService.signup(req.body, res,req);

    const filteredUser = user.toObject();

    delete filteredUser.__v

    sendResponse(res, 201, "sucess",{
        token,
        data: {filteredUser}
    });

});

const login = catchAsync(async (req,res,next) => {

    const token = await authService.login(req.body, res);

    sendResponse(res,200,"success", {token});

});

const logout = (req,res,next) => {

    // Overwrites the existing cookie
    res.cookie('jwt', '', {
        expires: new Date(Date.now() + 10 * 1000), // expires in 10s
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict'
    });

    sendResponse(res,200,'Logged out successfully');

};

const forgotPassword = catchAsync(async (req,res,next) => {

   const emailSent = await authService.forgotPassword(req);

    sendResponse(res,200,'Token sent to email');

});

const resetPassword = catchAsync(async (req,res,next) => {

    const token = await authService.resetPassword(req, res);

    sendResponse(res,200,"success",{token});

});

const updatePassword = catchAsync(async (req,res,next) => {

    const token = await authService.updatePassword(req, res);

    sendResponse(res,200,"success",{token});

});

module.exports = {
    signup,
    login,
    logout,
    forgotPassword,
    resetPassword,
    updatePassword
};