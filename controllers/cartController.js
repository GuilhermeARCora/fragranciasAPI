const cartService = require('../services/cartService');
const catchAsync = require("../utils/catchAsync");
const sendResponse = require('../utils/sendResponse');

const createCart = catchAsync(async(req,res,next) => {

    const cart = await cartService.createCart(req.user.id, req.body);

    sendResponse(res, 201, "Cart created!", {cart});

});

const getCart = catchAsync(async(req,res,next) => {

    const cart = await cartService.getCart(req.user.id);

    sendResponse(res, 200, "There is your cart!", {cart});

});

const editCart = catchAsync(async(req,res,next) => {

    const cart = await cartService.editCart(req.user.id, req.body);

    sendResponse(res, 200, "Cart edited with success!", {cart});

});

const clearCart = catchAsync(async(req,res,next) => {

    await cartService.clearCart(req.user.id);

    sendResponse(res, 204, "Cart cleared");

});

module.exports = {
    createCart,
    getCart,
    editCart,
    clearCart
};