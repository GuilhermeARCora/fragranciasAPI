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

module.exports = {
    signup,
    login
};