const Order = require('../models/order');

const create = async(data) =>{

  const created = await Order.create(data);
  const order = await Order.findById(created._id).select({ updatedAt: 0, createdAt: 0, __v: 0 });
  
  return order;
};

const findAll = async (reqQuery) => {
  const allowedFilters = {
    _id: v => v,
    status: v => v,
    totalUnits: Number,
    totalFullPrice: Number,
    totalCurrentPrice: Number,
    totalDiscount: Number,
    totalPixPrice: Number
  };

  const filters = Object.entries(reqQuery).reduce((acc, [key, value]) => {
    if (allowedFilters[key] && value !== undefined && value !== '') {
      acc[key] = allowedFilters[key](value);
    }
    return acc;
  }, {});

  return Order.find(filters, {updatedAt:0, createdAt:0, __v:0});
};

const findOne = async(id) =>{

  const order = await Order.findById(id, {updatedAt:0, createdAt:0, __v:0});

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

module.exports = {
  create,
  findAll,
  findOne,
  update,
};