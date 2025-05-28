const productDao = require('../daos/productDao');

exports.createProduct = async (obj) => {
  // Aqui poderia ter validação, formatação, etc.
  return await productDao.createProduct(obj);
};
