const catchAsync = require("../utils/catchAsync");
const sendResponse = require('../utils/sendResponse');
const productService = require('../services/productService');

const createOneProduct = catchAsync(async(req,res,next) => {

  const product = await productService.createOneProduct(req.body);

  sendResponse(res, 201, "sucess", {product});

});

module.exports = {
  createOneProduct
};