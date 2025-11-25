const dayjs = require('dayjs');
const orderDao = require('./order.dao');
const AppError = require('../../core/utils/appError');
const filterFields = require('../../core/utils/filterFields');
require('dayjs/locale/pt-br');

dayjs.locale('pt-br');

const create = async (reqBody) => {
  const safeData = filterFields(reqBody, 'items');

  const order = await orderDao.create(safeData);

  return order;
};

const findAll = async (reqQuery) => {
  const order = await orderDao.findAll(reqQuery);

  return order;
};

const findOne = async (id) => {
  const order = await orderDao.findOne(id);

  if (!order) throw new AppError('O Id deste pedido não existe!', 404);

  return order;
};

const update = async (reqParamsId, reqBody) => {
  const id = reqParamsId;
  const { status } = reqBody;

  const safeData = filterFields(reqBody, 'status');

  if (status) {
    if (status !== 'CONCLUIDO' && status !== 'CANCELADO') throw new AppError('O status passado é inválido!', 404);
  }

  const order = await orderDao.findOne(id);
  if (order.status === 'CONCLUIDO') throw new AppError('O pedido já foi concluido!', 404);
  if (order.status === 'CANCELADO') throw new AppError('O pedido já foi cancelado!', 404);

  const orderUpdated = await orderDao.update({ id, ...safeData });

  if (!orderUpdated) throw new AppError('O Id deste pedido não existe!', 404);

  return orderUpdated;
};

const findStatistics = async () => {
  const items = await orderDao.findItemsInOrders();
  const [{
    amountStatusPendente,
    amountStatusConcluido,
    amountStatusCancelado,
    amountInTheLastTwoDays
  }] = await orderDao.findStatusStatistics();

  const statistics = {
    amountStatusPendente,
    amountStatusConcluido,
    amountStatusCancelado,
    amountInTheLastTwoDays,
    amountWithFinalPriceOverFiveHundred: 0
  };

  statistics.amountWithFinalPriceOverFiveHundred = items
    .reduce((acc, order) => acc + (order.totalCurrentPrice > 500 ? 1 : 0), 0);

  return statistics;
};

const findOrdersEvolution = async () => {
  const orders = await orderDao.findOrdersEvolution();

  const monthsData = Array.from({ length: 12 }, (_, i) => {
    const d = dayjs().subtract(11 - i, 'month');
    return {
      key: d.format('MM-YYYY'),
      month: d.locale('pt-br').format('MMM'),
      PENDENTE: 0,
      CONCLUIDO: 0,
      CANCELADO: 0
    };
  });

  orders.forEach((order) => {
    const orderKey = dayjs(order.createdAt).format('MM-YYYY');
    const entry = monthsData.find((m) => m.key === orderKey);
    if (entry && order.status) {
      entry[order.status]++;
    }
  });

  // eslint-disable-next-line no-unused-vars
  return monthsData.map(({ key, ...rest }) => rest);
};

module.exports = {
  create,
  findAll,
  findOne,
  update,
  findStatistics,
  findOrdersEvolution
};
