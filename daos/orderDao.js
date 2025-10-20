const Order = require('../models/order');
const dayjs = require('dayjs');

const create = async(data) =>{

  const created = await Order.create(data);
  const order = await Order.findById(created._id).select({ updatedAt: 0, createdAt: 0, __v: 0 });
  
  return order;
};

const findAll = async (reqQuery) => {
  const filters = {};

  // filtros envolvendo atributos salvos no banco do banco
  if (reqQuery._id) filters._id = reqQuery._id;
  if (reqQuery.status) filters.status = reqQuery.status;

  const orders = await Order.find(filters, { updatedAt: 0, __v: 0 });

  // filtros envolvendo as variaveis "virtuais" do schema, em memória
  const filtered = orders.filter(order => {
    if (reqQuery.totalUnits && order.totalUnits < Number(reqQuery.totalUnits)) return false;
    if (reqQuery.totalFullPrice && order.totalFullPrice < Number(reqQuery.totalFullPrice)) return false;
    if (reqQuery.totalCurrentPrice && order.totalCurrentPrice < Number(reqQuery.totalCurrentPrice)) return false;
    if (reqQuery.totalDiscount && order.totalDiscount < Number(reqQuery.totalDiscount)) return false;
    if (reqQuery.totalPixPrice && order.totalPixPrice < Number(reqQuery.totalPixPrice)) return false;
    if (reqQuery.daysAgo) {
      const days = Number(reqQuery.daysAgo);
      const limitDate = dayjs().subtract(days, 'day');
      if (dayjs(order.createdAt).isBefore(limitDate)) return false;
    }
    return true;
  });

  return filtered;
};

const findOne = async(id) =>{

  const order = await Order.findById(id, {updatedAt:0, __v:0});
  console.log(order.createdAt);
  console.log(order.dayItWasIssued);

  return order;
};

const update = async({id, ...updates}) =>{

  const order = await Order.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true,
    }
  ).select({updatedAt:0, createdAt:0, __v:0});

  return order;
};

const findStatistics = async() =>{

  const orders = await Order.find();

  return orders;
};

const findOrdersEvolution = async () => {
  const twelveMonthsAgo = dayjs().subtract(12, 'month').startOf('month');
  const orders = await Order.find({ createdAt: { $gte: twelveMonthsAgo.toDate() } })
    .select({createdAt: 1, status: 1})
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