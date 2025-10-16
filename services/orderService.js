const orderDao = require('../daos/orderDao');
const AppError = require('../utils/appError');
const filterFields = require('../utils/filterFields');

const create = async(reqBody) =>{

  const safeData = filterFields(reqBody, 'items');

  const order = await orderDao.create(safeData);

  return order;
};

const findAll = async(reqQuery) =>{

  const order = await orderDao.findAll(reqQuery);

  return order;
};

const findOne = async(id) =>{

  const order = await orderDao.findOne(id);
  
  if(!order) throw new AppError("O Id deste pedido não existe!", 404);
  
  return order;
};

const update = async(reqParamsId, reqBody) =>{

  const id = reqParamsId;
  const {status} = reqBody;

  const safeData = filterFields(reqBody, 'status');

  if(status){
    if(status !== 'CONCLUIDO' && status !== 'CANCELADO') throw new AppError("O status passado é inválido!", 404);
  };

  const order = await orderDao.findOne(id);
  if(order.status === 'CONCLUIDO') throw new AppError("O pedido já foi concluido!", 404);

  const orderUpdated = await orderDao.update({id, ...safeData});
  
  if(!orderUpdated) throw new AppError("O Id deste pedido não existe!", 404);
  
  return orderUpdated;
};

module.exports = {
  create,
  findAll,
  findOne,
  update,
};