const Product = require('../models/product');

const createOneProduct = async(data) =>{

  const product = await Product.create(data);

  return product;
};

module.exports = {
  createOneProduct
};