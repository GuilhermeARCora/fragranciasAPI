const User = require('../models/user');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const {promisify} = require('util');

//for this middleware work properly it has to come after the protect, that will store the user role in the req.user
const restrictTo = (...roles) => {
    return (req,res,next) => {
        //roles ['admin']; role='user' --> should not acess
        if(!roles.includes(req.user.role)){
            throw new AppError('Você não possui permissão para executar essa tarefa!', 403);
        };

        next();
    }
};

module.exports = {
    restrictTo
};