const catchAsync = require("../utils/catchAsync");
const sendResponse = require('../utils/sendResponse');
const productService = require('../services/productService');

const createOneProduct = catchAsync(async(req,res,next) => {

  if (!req.fileUrl) {
    return next(new AppError('A imagem é obrigatória', 400));
  };

  const payload = { ...req.body };
  payload.image = req.fileUrl;
  const product = await productService.createOneProduct(payload);

  sendResponse(res, 201, "success", {product});

});

const getAllProducts = catchAsync(async(req,res,next) => {

  const products = await productService.getAllProducts();

  sendResponse(res,200,"success",{
      products, 
      amount: products.length
    });

});

const getProductsByCategory = catchAsync(async(req,res,next) => {
  const { category, limit = 10, page = 1 } = req.query;

  const products = await productService.getProductsByCategory(category, Number(limit), Number(page));

  sendResponse(res,200,"success",{
      products, 
      amount: products.length
    });

});

const getOneProduct = catchAsync(async(req,res,next) => {

  const product = await productService.getOneProduct(req.params.id);

  sendResponse(res,200,"success",{product});

});

const getNovidades = catchAsync(async(req,res,next) => {

  const products = await productService.getNovidades();

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

const editOneProduct = catchAsync(async(req,res,next) => {

  const payload = { ...req.body };

  if (req.fileUrl) {
    payload.image = req.fileUrl; // só atualiza se realmente veio arquivo novo
  };

  const product = await productService.editOneProduct(req.params.id, payload);

  sendResponse(res,200,"success",{product});

});

const changeStatus = catchAsync(async(req,res,next) => {

  const product = await productService.changeStatus(req.params.id, req.body);

  sendResponse(res,204,"success",{product});

});

const deleteOneProduct = catchAsync(async(req,res,next) => {

  await productService.deleteOneProduct(req.params.id);

  sendResponse(res,204,"success");

});

module.exports = {
  createOneProduct,
  getAllProducts,
  getOneProduct,
  editOneProduct,
  deleteOneProduct,
  getNovidades,
  searchAutoComplete,
  getProductsByCategory,
  changeStatus
};