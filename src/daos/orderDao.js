const dayjs = require('dayjs');
const Order = require('../models/order');

const create = async (data) => {
  const created = await Order.create(data);
  const order = await Order.findById(created._id).select({ updatedAt: 0, createdAt: 0, __v: 0 });

  return order;
};

const findAll = async (query) => {
  const filters = {};

  // filtros envolvendo atributos salvos no banco do banco
  if (query._id) filters._id = query._id;
  if (query.status) filters.status = query.status;

  const orders = await Order.find(filters, { updatedAt: 0, __v: 0 });

  // filtros envolvendo as variaveis "virtuais" do schema, em memória
  const filtered = orders.filter((order) => {
    if (query.totalUnits && order.totalUnits < Number(query.totalUnits)) return false;
    if (query.totalFullPrice && order.totalFullPrice < Number(query.totalFullPrice)) return false;
    // eslint-disable-next-line max-len
    if (query.totalCurrentPrice && order.totalCurrentPrice < Number(query.totalCurrentPrice)) return false;
    if (query.totalDiscount && order.totalDiscount < Number(query.totalDiscount)) return false;
    if (query.totalPixPrice && order.totalPixPrice < Number(query.totalPixPrice)) return false;
    if (query.daysAgo) {
      const days = Number(query.daysAgo);
      const limitDate = dayjs().subtract(days, 'day');
      if (dayjs(order.createdAt).isBefore(limitDate)) return false;
    }
    return true;
  });

  return filtered;
};

const findOne = async (id) => {
  const order = await Order.findById(id, { updatedAt: 0, __v: 0 });
  console.log(order.createdAt);
  console.log(order.dayItWasIssued);

  return order;
};

const update = async ({ id, ...updates }) => {
  const order = await Order.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true
  }).select({ updatedAt: 0, createdAt: 0, __v: 0 });

  return order;
};

const findStatistics = async () => {
  const orders = await Order.find();

  return orders;
};

const findOrdersEvolution = async () => {
  const twelveMonthsAgo = dayjs().subtract(12, 'month').startOf('month');
  const orders = await Order.find({ createdAt: { $gte: twelveMonthsAgo.toDate() } })
    .select({ createdAt: 1, status: 1 })
    .lean();

  return orders;
};

module.exports = {
  create,
  findAll,
  findOne,
  update,
  findStatistics,
  findOrdersEvolution
};
