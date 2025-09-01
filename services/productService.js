const productDao = require('../daos/productDao');
const AppError = require('../utils/appError');
const filterFields = require('../utils/filterFields');

const createOneProduct = async(reqBody) =>{

  const safeData = filterFields(reqBody, 'name', 'fullPrice', 'description', 'imageUrl', 'categories', 'active', 'isInPromo');

  const createdProduct = await productDao.createOneProduct(safeData);

  return createdProduct;
};

const getAllProducts = async() =>{

  const products = await productDao.getAllProducts();

  return products;
};

const getProductsByCategory = async (category, limit = 10, page = 1) => {
  if (!category) throw new AppError("Categoria é obrigatório", 400);

  const validCategories = ['aromatizadores', 'autoCuidado', 'casaEBemEstar'];
  if (!validCategories.includes(category)) {
    throw new AppError("Categoria inválida", 400);
  }

  return productDao.getProductsByCategory(category, limit, page);
};

const getOneProduct = async(id) =>{

  const product = await productDao.getOneProduct(id);
  
  if(!product){
    throw new AppError("O Id deste produto não existe!", 404)
  };
  
  return product;
};

const getNovidades = async() =>{

  const products = await productDao.getNovidades();
  
  return products;
};

const searchAutoComplete = async(reqQuery) =>{

  if (!reqQuery || reqQuery.trim().length < 2) {
    throw new AppError("A query de busca deve ter pelo menos 2 caracteres", 400);
  };

  const products = await productDao.searchAutoComplete(reqQuery);
  
  return products;
};

const editOneProduct = async(reqParamsId, reqBody) =>{

  const id = reqParamsId;

  const safeData = filterFields(reqBody, 'name', 'fullPrice', 'description', 'imageUrl', 'categories', 'active', 'isInPromo');

  const product = await productDao.editOneProduct({id, ...safeData});
  
  if(!product){
    throw new AppError("O Id deste produto não existe!", 404)
  };
  
  return product;
};

const deleteOneProduct = async(id) =>{

  const deleted = await productDao.deleteOneProduct(id);
  
  if(!deleted){
    throw new AppError("O Id deste produto não existe!", 404)
  };
  
  return deleted;
};

module.exports = {
  createOneProduct,
  getAllProducts,
  getOneProduct,
  editOneProduct,
  deleteOneProduct,
  getNovidades,
  searchAutoComplete,
  getProductsByCategory
};