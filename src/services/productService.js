const productDao = require('../daos/productDao');
const AppError = require('../utils/appError');
const filterFields = require('../utils/filterFields');

const create = async (reqBody) => {
  const safeData = filterFields(reqBody, 'name', 'fullPrice', 'description', 'image', 'categories', 'active', 'promoPercentage', 'cod');

  const createdProduct = await productDao.create(safeData);

  return createdProduct;
};

const findAll = async (reqQuery) => {
  const products = await productDao.findAll(reqQuery);

  return products;
};

const findByCategory = async (category, limit = 10, page = 1) => {
  if (!category) throw new AppError('Categoria é obrigatório', 400);

  const validCategories = ['aromatizadores', 'autoCuidado', 'casaEBemEstar'];
  if (!validCategories.includes(category)) throw new AppError('Categoria inválida', 400);

  const products = await productDao.findByCategory(category, limit, page);

  return products;
};

const findOne = async (id) => {
  const product = await productDao.findOne(id);

  if (!product) throw new AppError('O Id deste produto não existe!', 404);

  return product;
};

const findStatistics = async () => {
  const products = await productDao.findStatistics();

  const statistics = {
    countActiveProds: 0,
    countInactiveProds: 0,
    countInPromo: 0,
    greatestDiscount: 0,
    countProdsAroma: 0,
    countProdsAuto: 0,
    countProdsCasa: 0
  };

  products.forEach((prod) => {
    if (prod.active) statistics.countActiveProds++;
    else statistics.countInactiveProds++;

    const discount = Number(prod.promoPercentage) || 0;
    if (discount > 0 && prod.active) statistics.countInPromo++;
    if (statistics.greatestDiscount < discount) statistics.greatestDiscount = discount;

    if (prod.categories) {
      prod.categories.forEach((cat) => {
        if (cat.includes('aromatizadores')) statistics.countProdsAroma++;
        if (cat.includes('autoCuidado')) statistics.countProdsAuto++;
        if (cat.includes('casaEBemEstar')) statistics.countProdsCasa++;
      });
    }
  });

  return statistics;
};

const newProducts = async () => {
  const products = await productDao.newProducts();

  return products;
};

const update = async (reqParamsId, reqBody) => {
  const id = reqParamsId;

  const safeData = filterFields(reqBody, 'name', 'fullPrice', 'description', 'image', 'categories', 'active', 'promoPercentage', 'cod');

  const product = await productDao.update({ id, ...safeData });

  if (!product) throw new AppError('O Id deste produto não existe!', 404);

  return product;
};

const changeStatus = async (reqParamsId, reqBody) => {
  const id = reqParamsId;

  const safeData = filterFields(reqBody, 'active');

  const product = await productDao.changeStatus({ id, ...safeData });

  if (!product) throw new AppError('O Id deste produto não existe!', 404);

  return product;
};

const remove = async (id) => {
  const deleted = await productDao.remove(id);

  if (!deleted) throw new AppError('O Id deste produto não existe!', 404);

  return deleted;
};

module.exports = {
  create,
  findAll,
  findOne,
  newProducts,
  update,
  remove,
  findByCategory,
  changeStatus,
  findStatistics
};
