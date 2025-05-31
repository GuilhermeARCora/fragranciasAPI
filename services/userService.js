const userDao = require('../daos/userDao');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');

const createOne = async (data) => {
  return userDao.createOne(data);
};

const findOne = async (id) => {

  const foundId = await userDao.findOne(id);

  if (!foundId) {
    throw new AppError('No data found with that ID', 404);
  }
 
  return foundId;
};

const findAll = async (reqQuery) => {

  const query = userDao.findAll()

  const features = new APIFeatures(query, reqQuery)
        .filter()
        .sort()
        .limitFields()
        .paginate();
  
  const result = await features.query;

  return result;    

};

const updatePatch = async (id, updates) => {

  const updated = await userDao.updatePatch({ id, ...updates });

  if (!updated) {
    throw new AppError('No data found with that ID', 404);
  }
 
  return updated;
};

const deleteOne = async (id) => {

  const result = await userDao.deleteOne(id);

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
