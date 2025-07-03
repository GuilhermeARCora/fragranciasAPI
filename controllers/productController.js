const catchAsync = require("../utils/catchAsync");
const sendResponse = require('../utils/sendResponse');
const productService = require('../services/productService');

const createOneProduct = catchAsync(async(req,res,next) => {

  const product = await productService.createOneProduct(req.body);

  sendResponse(res, 201, "success", {product});

});

const getAllProducts = catchAsync(async(req,res,next) => {

  const products = await productService.getAllProducts();

  sendResponse(res,200,"success",{
      products, 
      amount: products.length
    });

});

const getOneProduct = catchAsync(async(req,res,next) => {

  const product = await productService.getOneProduct(req.params.id);

  sendResponse(res,200,"success",{product});

});

const editOneProduct = catchAsync(async(req,res,next) => {

  const product = await productService.editOneProduct(req.params.id, req.body);

  sendResponse(res,200,"success",{product});

});

const deleteOneProduct = catchAsync(async(req,res,next) => {

  const deleted = await productService.deleteOneProduct(req.params.id);

  sendResponse(res,204,"success");

});

module.exports = {
  createOneProduct,
  getAllProducts,
  getOneProduct,
  editOneProduct,
  deleteOneProduct
};