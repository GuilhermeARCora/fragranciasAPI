const catchAsync = require("../utils/catchAsync");
const sendResponse = require('../utils/sendResponse');
const orderService = require('../services/orderService');

const create = catchAsync(async(req,res,next) => {

  const order = await orderService.create(req.body);

  sendResponse(res, 201, "success", order);
});

const findAll = catchAsync(async(req,res,next) => {

  const orders = await orderService.findAll(req.query);

  sendResponse(res,200,"success",{
      orders, 
      amount: orders.length
    });
});

const findOne = catchAsync(async(req,res,next) => {

  const order = await orderService.findOne(req.params.id);

  sendResponse(res,200,"success",order);
});

const update = catchAsync(async(req,res,next) => {

  const order = await orderService.update(req.params.id, req.body);

  sendResponse(res,200,"success",order);
});

module.exports = {
  create,
  findAll,
  findOne,
  update,
};