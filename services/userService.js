const userDao = require('../daos/userDao');
const APIFeatures = require('../utils/apiFeatures');

const createUser = async (userData) => {
  return userDao.createUser(userData);
};

const findUser = async (id) => {

  const user = await userDao.findUser(id);
 
  return user;
};

const findAllUsers = async (reqQuery) => {

  const query = userDao.findAllUsers()

  const features = new APIFeatures(query, reqQuery)
        .filter()
        .sort()
        .limitFields()
        .paginate();
  
  const users = await features.query;

  return users;    

};

const updateUser = async (id, updates) => {

  const updated = await userDao.updateUser({ id, ...updates });
 
  return updated;
};

const deleteUser = async (id) => {

  const result = await userDao.deleteUser(id);

  return result;
};

module.exports = {
  createUser,
  findUser,
  deleteUser,
  updateUser,
  findAllUsers
};
