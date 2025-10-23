const catchAsync = require('../utils/catchAsync');
const sendResponse = require('../utils/sendResponse');
const productService = require('../services/productService');
const AppError = require('../utils/appError');

// eslint-disable-next-line consistent-return
const create = catchAsync(async (req, res, next) => {
  if (!req.fileUrl) {
    return next(new AppError('A imagem é obrigatória', 400));
  }

  const payload = { ...req.body };
  payload.image = req.fileUrl;
  const product = await productService.create(payload);

  sendResponse(res, 201, 'success', product);
});

const findAll = catchAsync(async (req, res, next) => {
  const products = await productService.findAll(req.query);

  sendResponse(res, 200, 'success', {
    products,
    amount: products.length
  });
});

// eslint-disable-next-line consistent-return
const findByCategory = catchAsync(async (req, res, next) => {
  const { limit = 10, page = 1 } = req.query;

  const products = await productService
    .findByCategory(req.params.category, Number(limit), Number(page));

  if (products.length === 0) {
    return sendResponse(res, 200, 'Todos os produtos dessa categoria já foram retornados', {
      products: [],
      amount: 0
    });
  }

  sendResponse(res, 200, 'success', {
    products,
    amount: products.length
  });
});

const findOne = catchAsync(async (req, res, next) => {
  const product = await productService.findOne(req.params.id);

  sendResponse(res, 200, 'success', product);
});

const findStatistics = catchAsync(async (req, res, next) => {
  const statistics = await productService.findStatistics();

  sendResponse(res, 200, 'success', statistics);
});

const newProducts = catchAsync(async (req, res, next) => {
  const products = await productService.newProducts();

  sendResponse(res, 200, 'success', {
    products,
    amount: products.length
  });
});

const update = catchAsync(async (req, res, next) => {
  const payload = { ...req.body };

  if (req.fileUrl) {
    payload.image = req.fileUrl; // só atualiza se realmente veio arquivo novo
  }

  const product = await productService.update(req.params.id, payload);

  sendResponse(res, 200, 'success', product);
});

const changeStatus = catchAsync(async (req, res, next) => {
  const product = await productService.changeStatus(req.params.id, req.body);

  sendResponse(res, 200, 'success', product);
});

const remove = catchAsync(async (req, res, next) => {
  await productService.remove(req.params.id);

  sendResponse(res, 204, 'success', {});
});

module.exports = {
  create,
  findAll,
  findOne,
  newProducts,
  update,
  remove,
  findByCategory,
  changeStatus,
  findStatistics
};
