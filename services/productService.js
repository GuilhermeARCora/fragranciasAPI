const productDao = require('../daos/productDao');
const filterFields = require('../utils/filterFields');

const createOneProduct = async(reqBodyObj) =>{

  const safeProduct = filterFields(reqBodyObj, "name", "price", "description");

  const createdProduct = await productDao.createOneProduct(safeProduct);

  return createdProduct;
};

module.exports = {
  createOneProduct
};