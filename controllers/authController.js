const catchAsync = require('../utils/catchAsync');
const authService = require('../services/authService');

const signup = catchAsync(async (req,res,next) => {
    
    const newUser = await authService.signup(req.body);

    res.status(201).json({
        status:"success",
        data:{
            user: newUser
        }
    });

});

module.exports = {
    signup
}