const productDao = require('../daos/productDao');
const AppError = require('../utils/appError');

const createOneProduct = async(payload) =>{

  const createdProduct = await productDao.createOneProduct(payload);

  return createdProduct;
};

const getAllProducts = async() =>{

  const products = await productDao.getAllProducts();

  return products;
};

const getOneProduct = async(id) =>{

  const product = await productDao.getOneProduct(id);
  
  if(!product){
    throw new AppError("This products Id does not exist", 404)
  };
  
  return product;
};

const editOneProduct = async(reqParamsId, body) =>{

  const id = reqParamsId;

  const product = await productDao.editOneProduct({id, ...body});
  
  if(!product){
    throw new AppError("This products Id does not exist", 404)
  };
  
  return product;
};

const deleteOneProduct = async(id) =>{

  const deleted = await productDao.deleteOneProduct(id);
  
  if(!deleted){
    throw new AppError("This products Id does not exist", 404)
  };
  
  return deleted;
};

module.exports = {
  createOneProduct,
  getAllProducts,
  getOneProduct,
  editOneProduct,
  deleteOneProduct
};