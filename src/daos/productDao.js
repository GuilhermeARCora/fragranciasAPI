const Product = require('../models/product');

const create = async (data) => {
  const created = await Product.create(data);
  const product = await Product
    .findById(created._id).select({ updatedAt: 0, createdAt: 0, __v: 0 });

  return product;
};

const findAll = async (reqQuery) => {
  const filters = {};

  if (reqQuery.cod) filters.cod = Number(reqQuery.cod);
  if (reqQuery.fullPrice) filters.fullPrice = { $gte: Number(reqQuery.fullPrice) };
  if (reqQuery.active !== undefined) filters.active = reqQuery.active === 'true';
  if (reqQuery.categories) filters.categories = { $in: reqQuery.categories.split(',') };

  if (reqQuery.isInPromo === 'true' && reqQuery.promoPercentage) {
    filters.promoPercentage = { $gte: Number(reqQuery.promoPercentage) };
  } else if (reqQuery.isInPromo === 'true') {
    filters.promoPercentage = { $gt: 0 };
  } else if (reqQuery.promoPercentage) {
    filters.promoPercentage = { $gte: Number(reqQuery.promoPercentage) };
  }

  return Product.find(filters, { updatedAt: 0, createdAt: 0, __v: 0 }).sort({ name: -1 });
};

const findByCategory = async (category, limit, page) => {
  const skip = (page - 1) * limit;
  const products = await Product.find({ categories: category, active: true }, {
    createdAt: 0, updatedAt: 0, cod: 0, active: 0, categories: 0, __v: 0
  })
    .sort({ name: -1 })
    .skip(skip)
    .limit(limit);

  return products;
};

const countDestaque = async () => {
  const products = await Product.countDocuments({ categories: 'destaque' });

  return products;
};

const findOne = async (id) => {
  const product = await Product.findById(id, { updatedAt: 0, createdAt: 0, __v: 0 });

  return product;
};

const findStatistics = async () => {
  const products = await Product.find()
    .select({ active: 1, promoPercentage: 1, categories: 1 })
    .lean();

  return products;
};

const newProducts = async () => {
  const products = await Product.find({}, {
    createdAt: 0, updatedAt: 0, cod: 0, active: 0, categories: 0, __v: 0
  })
    .sort({ createdAt: -1 })
    .limit(10);

  return products;
};

const update = async ({ id, ...updates }) => {
  const product = await Product.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true
  }).select({ updatedAt: 0, createdAt: 0, __v: 0 });

  return product;
};

const changeStatus = async ({ id, ...updates }) => {
  const product = await Product.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true
  }).select({ updatedAt: 0, createdAt: 0, __v: 0 });

  return product;
};

const remove = async (id) => {
  const deleted = await Product
    .findByIdAndDelete(id).select({ updatedAt: 0, createdAt: 0, __v: 0 });

  return deleted;
};

module.exports = {
  create,
  findAll,
  countDestaque,
  findOne,
  newProducts,
  update,
  remove,
  findByCategory,
  changeStatus,
  findStatistics
};
