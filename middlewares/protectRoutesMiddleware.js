const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const protect = catchAsync(async (req,res,next) => {
    let token;
    // 1) Getting token and checking if it's there
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1];
    };
    
    if(!token){
        throw new AppError('You are not logged in! Please log in to get acess. ', 401);
    };
    // 2) Verification token
    // 3) Check if user still exists

    // 4) Check if user changed password after the token was issued

    next();
});

module.exports = {
    protect
}