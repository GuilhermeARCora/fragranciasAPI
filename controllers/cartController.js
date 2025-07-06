const cartService = require('../services/cartService');
const catchAsync = require("../utils/catchAsync");
const sendResponse = require('../utils/sendResponse');

const createCart = catchAsync(async(req,res,next) => {

    const cart = await cartService.createCart(req.user.id, req.body);

    sendResponse(res, 201, "success", {cart});

});

// const getCart = catchAsync(async(req,res,next) => {

//     const cart = await cartService.getCart(req.user.id);

//     sendResponse(res, 200, "success", {cart});

// });

// const editCart = catchAsync(async(req,res,next) => {

//     const cart = await cartService.editCart(req.user.id, req.body);

//     sendResponse(res, 200, "success", {cart});

// });

module.exports = {
    createCart,
    // getCart,
    // editCart
};