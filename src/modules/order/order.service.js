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
  const orders = await orderDao.findStatistics();

  const statistics = {
    amountStatusPendente: 0,
    amountStatusConcluido: 0,
    amountStatusCancelado: 0,
    amountInTheLastTwoDays: 0,
    amountWithFinalPriceOverFiveHundred: 0
  };

  const limitDate = dayjs().subtract(2, 'day');

  orders.forEach((order) => {
    if (order.status === 'PENDENTE') statistics.amountStatusPendente++;
    else if (order.status === 'CONCLUIDO') statistics.amountStatusConcluido++;
    else if (order.status === 'CANCELADO') statistics.amountStatusCancelado++;

    if (dayjs(order.createdAt).isAfter(limitDate)) statistics.amountInTheLastTwoDays++;

    if (order.totalCurrentPrice > 500) statistics.amountWithFinalPriceOverFiveHundred++;
  });

  return statistics;
};

const findOrdersEvolution = async () => {
  const orders = await orderDao.findOrdersEvolution();

  // Cria estrutura inicial com meses zerados
  const monthsData = Array.from({ length: 12 }, (_, i) => {
    const d = dayjs().subtract(11 - i, 'month');
    return {
      month: d.locale('pt-br').format('MMM'), // "Jan", "Fev", etc.
      PENDENTE: 0,
      CONCLUIDO: 0,
      CANCELADO: 0
    };
  });

  // Agrupa pedidos
  orders.forEach((order) => {
    const month = dayjs(order.createdAt).format('MMM');
    const entry = monthsData.find((m) => m.month === month);
    if (entry && order.status) entry[order.status]++;
  });

  return monthsData;
};

module.exports = {
  create,
  findAll,
  findOne,
  update,
  findStatistics,
  findOrdersEvolution
};
