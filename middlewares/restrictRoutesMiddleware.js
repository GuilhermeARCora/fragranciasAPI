const User = require('../models/user');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const {promisify} = require('util');

//for this middleware work properly it has to come after the protect, that will store the user role in the req.user
const restrictTo = (...roles) => {
    return (req,res,next) => {
        //roles ['admin', 'master']; role='user' --> should not acess
        if(!roles.includes(req.user.role)){
            throw new AppError('You do not have permission to perform this action', 403);
        };

        next();
    }
};

module.exports = {
    restrictTo
};