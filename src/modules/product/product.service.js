const productDao = require('./product.dao');
const AppError = require('../../core/utils/appError');
const filterFields = require('../../core/utils/filterFields');
const deleteImage = require('../../core/utils/supabaseDelete');

// There can only be 10 products with the category 'destaque'
const checkIfDestaqueIsNotFull = async function (id = '') {
  let amount;
  const productsWithDestaqueCount = await productDao.countDestaque();

  amount = productsWithDestaqueCount;

  if (id) {
    let productsWithDestaque = await productDao.findByCategory('destaque');
    productsWithDestaque = productsWithDestaque.filter((v) => !(v._id === id));
    amount = productsWithDestaque.length;
  }

  if (amount >= 10) throw new AppError('Já existem 10 produtos como destaque', 400);

  return true;
};

const create = async (reqBody) => {
  const safeData = filterFields(reqBody, 'name', 'fullPrice', 'description', 'image', 'categories', 'active', 'promoPercentage', 'cod');

  if (safeData.categories.includes('destaque')) await checkIfDestaqueIsNotFull();

  const createdProduct = await productDao.create(safeData);

  return createdProduct;
};

const findAll = async (reqQuery) => {
  const products = await productDao.findAll(reqQuery);

  return products;
};

const findByCategory = async (category, limit = 10, page = 1) => {
  if (!category) throw new AppError('Categoria é obrigatório', 400);

  const validCategories = ['aromatizadores', 'autoCuidado', 'casaEBemEstar', 'destaque'];
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
    countProdsCasa: 0,
    countProdsDest: 0
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
        if (cat.includes('destaque')) statistics.countProdsDest++;
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
  const currentProduct = await productDao.findOne(id);
  if (!currentProduct) throw new AppError('Produto não encontrado', 404);

  if (reqBody.image && currentProduct.image && reqBody.image !== currentProduct.image) {
    await deleteImage(process.env.PRODUCTS_BUCKET, currentProduct.image);
  }

  const safeData = filterFields(reqBody, 'name', 'fullPrice', 'description', 'image', 'categories', 'active', 'promoPercentage', 'cod');
  safeData.image = reqBody.image || currentProduct.image;

  if (safeData.categories.includes('destaque')) await checkIfDestaqueIsNotFull(id);

  const updatedProduct = await productDao.update({ id, ...safeData });

  if (!updatedProduct) throw new AppError('O Id deste produto não existe!', 404);

  return updatedProduct;
};

const changeStatus = async (reqParamsId, reqBody) => {
  const id = reqParamsId;

  const safeData = filterFields(reqBody, 'active');

  const product = await productDao.changeStatus({ id, ...safeData });

  if (!product) throw new AppError('O Id deste produto não existe!', 404);

  return product;
};

const remove = async (id) => {
  const product = await productDao.findOne(id);
  if (!product) throw new AppError('Produto não encontrado', 404);

  if (product.image) await deleteImage(process.env.PRODUCTS_BUCKET, product.image);

  const deleted = await productDao.remove(id);

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
