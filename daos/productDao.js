const Product = require('../models/product');

const createOneProduct = async(data) =>{

  const product = await Product.create(data);

  return product;
};

const getAllProducts = async() =>{

  const product = await Product.find();

  return product;
};

const getOneProduct = async(id) =>{

  const product = await Product.findById(id);

  return product;
};

const editOneProduct = async({id, ...updates}) =>{

  const product = await Product.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true
    });

  return product;
};

const deleteOneProduct = async(id) =>{

  const deleted = await Product.findByIdAndDelete(id);

  return deleted;
};

module.exports = {
  createOneProduct,
  getAllProducts,
  getOneProduct,
  editOneProduct,
  deleteOneProduct
};