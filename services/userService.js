const userDao = require('../daos/userDao');

const createUser = async (userData) => {
  return userDao.createUser(userData);
};

const findUser = async (id) => {

  const user = await userDao.findUser(id);
 
  return user;
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
  updateUser
};
