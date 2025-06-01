const productDao = require('../daos/productDao');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');

const createOne = async (data) => {
  return await productDao.createOne(data);
};

const findOne = async (id) => {

  const foundId = await productDao.findOne(id);

  if (!foundId) {
    throw new AppError('No data found with that ID', 404);
  }
 
  return foundId;
};

const findAll = async (reqQuery) => {

  const query = productDao.findAll()

  const features = new APIFeatures(query, reqQuery)
        .filter()
        .sort()
        .limitFields()
        .paginate();
  
  const result = await features.query;

  return result;    

};

const updatePatch = async (id, updates) => {

  const updated = await productDao.updatePatch({ id, ...updates });

  if (!updated) {
    throw new AppError('No data found with that ID', 404);
  }
 
  return updated;
};

const deleteOne = async (id) => {

  const result = await productDao.deleteOne(id);

  if (!result) {
    throw new AppError('No data found with that ID', 404);
  }

  return result;
};

module.exports = {
    createOne,
    updatePatch,
    deleteOne,
    findOne,
    findAll
};
