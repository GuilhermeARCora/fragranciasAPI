const userDao = require('../daos/userDao');
const APIFeatures = require('../utils/apiFeatures');

const createOne = async (data) => {
  return userDao.createOne(data);
};

const findOne = async (id) => {

  const foundId = await userDao.findOne(id);
 
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
 
  return updated;
};

const deleteOne = async (id) => {

  const result = await userDao.deleteOne(id);

  return result;
};

module.exports = {
    createOne,
    updatePatch,
    deleteOne,
    findOne,
    findAll
};
