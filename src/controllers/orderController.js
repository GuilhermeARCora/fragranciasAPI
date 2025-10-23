const catchAsync = require('../utils/catchAsync');
const sendResponse = require('../utils/sendResponse');
const orderService = require('../services/orderService');

const create = catchAsync(async (req, res, next) => {
  const order = await orderService.create(req.body);

  sendResponse(res, 201, 'success', order);
});

const findAll = catchAsync(async (req, res, next) => {
  const orders = await orderService.findAll(req.query);

  sendResponse(res, 200, 'success', {
    orders,
    amount: orders.length
  });
});

const findOne = catchAsync(async (req, res, next) => {
  const order = await orderService.findOne(req.params.id);

  sendResponse(res, 200, 'success', order);
});

const update = catchAsync(async (req, res, next) => {
  const order = await orderService.update(req.params.id, req.body);

  sendResponse(res, 200, 'success', order);
});

const findStatistics = catchAsync(async (req, res, next) => {
  const statistics = await orderService.findStatistics();

  sendResponse(res, 200, 'success', statistics);
});

const findOrdersEvolution = catchAsync(async (req, res, next) => {
  const monthsData = await orderService.findOrdersEvolution();

  sendResponse(res, 200, 'success', monthsData);
});

module.exports = {
  create,
  findAll,
  findOne,
  update,
  findStatistics,
  findOrdersEvolution
};
