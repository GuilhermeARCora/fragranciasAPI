const User = require('../models/user');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const {promisify} = require('util');

const protect = catchAsync(async (req,res,next) => {
    let token;
    // 1) Getting token and checking if it's there
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        //gets just the JWT part, ignores the Bearer
        token = req.headers.authorization.split(' ')[1];
    };

    if(!token){
        throw new AppError('You are not logged in! Please log in to get access.', 401);
    };

    // 2) Verification token
    // Verifys if the token has not been tempered with
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
    // In case of an error, the global error handling middleware has 2 functions that deal with an expired and an invalid token.

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if(!currentUser){
        throw new AppError('The user belonging to this token does no longer exist', 401);
    };

    // 4) Check if user changed password after the token was issued
    if(currentUser.changedPasswordAfter(decoded.iat)){
        throw new AppError('User recently changed password! Please log in again.', 401);
    };

    //Grant acess to protected route
    req.user = currentUser;
    next();
});

module.exports = {
    protect
}