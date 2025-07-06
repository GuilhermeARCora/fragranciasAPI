const cartService = require('../services/cartService');
const catchAsync = require("../utils/catchAsync");
const sendResponse = require('../utils/sendResponse');

const createCart = catchAsync(async(req,res,next) => {

    const cart = await cartService.createCart(req.user.id, req.body);

    sendResponse(res, 201, "success", {cart});

});

const getCart = catchAsync(async(req,res,next) => {

    const cart = await cartService.getCart(req.user.id);

    sendResponse(res, 200, "success", {cart});

});

const addOrEditItem = catchAsync(async(req,res,next) => {

    const cart = await cartService.addOrEditItem(req.user.id, req.body);

    sendResponse(res, 200, "success", {cart});

});

const deleteItem = catchAsync(async(req,res,next) => {

    const cart = await cartService.deleteItem(req.user.id, req.body);

    sendResponse(res, 204, "success", null);

});

module.exports = {
    createCart,
    getCart,
    addOrEditItem,
    deleteItem,
};