const catchAsync = require("../utils/catchAsync");
const sendResponse = require('../utils/sendResponse');
const productService = require('../services/productService');

const create = catchAsync(async(req,res,next) => {

  if (!req.fileUrl) {
    return next(new AppError('A imagem é obrigatória', 400));
  };

  const payload = { ...req.body };
  payload.image = req.fileUrl;
  const product = await productService.create(payload);

  sendResponse(res, 201, "success", product);

});

const findAll = catchAsync(async(req,res,next) => {

  const products = await productService.findAll(req.query);

  sendResponse(res,200,"success",{
      products, 
      amount: products.length
    });

});

const findByCategory = catchAsync(async(req,res,next) => {
  const { limit = 10, page = 1 } = req.query;

  const products = await productService.findByCategory(req.params.category, Number(limit), Number(page), res);

  sendResponse(res,200,"success",{
      products, 
      amount: products.length
    });

});

const findOne = catchAsync(async(req,res,next) => {

  const product = await productService.findOne(req.params.id);

  sendResponse(res,200,"success",product);
});

const newProducts = catchAsync(async(req,res,next) => {

  const products = await productService.newProducts();

  sendResponse(res,200,"success",{
      products, 
      amount: products.length
    });

});

const searchAutoComplete = catchAsync(async(req,res,next) => {

  const products = await productService.searchAutoComplete(req.query.q);

  sendResponse(res,200,"success",{
      products, 
      amount: products.length
    });

});

const update = catchAsync(async(req,res,next) => {

  const payload = { ...req.body };

  if (req.fileUrl) {
    payload.image = req.fileUrl; // só atualiza se realmente veio arquivo novo
  };

  const product = await productService.update(req.params.id, payload);

  sendResponse(res,200,"success",product);

});

const changeStatus = catchAsync(async(req,res,next) => {

  const product = await productService.changeStatus(req.params.id, req.body);

  sendResponse(res,200,"success",product);

});

const remove = catchAsync(async(req,res,next) => {

  await productService.remove(req.params.id);

  sendResponse(res,204,"success", {});

});

module.exports = {
  create,
  findAll,
  findOne,
  newProducts,
  update,
  remove,
  searchAutoComplete,
  findByCategory,
  changeStatus
};