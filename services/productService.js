const productDao = require('../daos/productDao');
const AppError = require('../utils/appError');
const filterFields = require('../utils/filterFields');

const create = async(reqBody) =>{

  const safeData = filterFields(reqBody, 'name', 'fullPrice', 'description', 'image', 'categories', 'active', 'promoPercentage', 'cod');

  const createdProduct = await productDao.create(safeData);

  return createdProduct;
};

const findAll = async(reqQuery) =>{

  const products = await productDao.findAll(reqQuery);

  return products;
};

const findByCategory = async (category, limit = 10, page = 1) => {
  if (!category) throw new AppError("Categoria é obrigatório", 400);

  const validCategories = ['aromatizadores', 'autoCuidado', 'casaEBemEstar'];
  if (!validCategories.includes(category))throw new AppError("Categoria inválida", 400);

  const products = await productDao.findByCategory(category, limit, page);

  return products;
};

const findOne = async(id) =>{

  const product = await productDao.findOne(id);
  
  if(!product) throw new AppError("O Id deste produto não existe!", 404);
  
  return product;
};

const newProducts = async() =>{

  const products = await productDao.newProducts();
  
  return products;
};

const searchAutoComplete = async(reqQuery) =>{

  if (!reqQuery || reqQuery.trim().length < 2) throw new AppError("A query de busca deve ter pelo menos 2 caracteres", 400);

  const products = await productDao.searchAutoComplete(reqQuery);
  
  return products;
};

const update = async(reqParamsId, reqBody) =>{

  const id = reqParamsId;

  const safeData = filterFields(reqBody, 'name', 'fullPrice', 'description', 'image', 'categories', 'active', 'promoPercentage', 'cod');

  const product = await productDao.update({id, ...safeData});
  
  if(!product) throw new AppError("O Id deste produto não existe!", 404);
  
  return product;
};

const changeStatus = async(reqParamsId, reqBody) =>{

  const id = reqParamsId;

  const safeData = filterFields(reqBody, 'active');

  const product = await productDao.changeStatus({id, ...safeData});
  
  if(!product) throw new AppError("O Id deste produto não existe!", 404);
  
  return product;
};

const remove = async(id) =>{

  const deleted = await productDao.remove(id);
  
  if(!deleted) throw new AppError("O Id deste produto não existe!", 404);
  
  return deleted;
};

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