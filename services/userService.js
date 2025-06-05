const userDao = require('../daos/userDao');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {}
    Object.keys(obj).forEach(el => {
      if(allowedFields.includes(el)){
        newObj[el] = obj[el];
      }; 
    });
  return newObj;
};

const createOne = async (data) => {
  return await userDao.createOne(data);
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

const updateUserByAdmin = async (id, updates) => {

  const updated = await userDao.updateUserByAdmin({ id, ...updates });

  if (!updated) {
    throw new AppError('No data found with that ID', 404);
  }
 
  return updated;
};

const updateUserByUser = async (reqBody, reqUser) => {

  const body = reqBody;

  if('password' in body || 'confirmPassword' in body){
    throw new AppError('This route is not for password updates. Please use /updateMyPassword');
  };

  const id = reqUser.id;
  const filteredBody = filterObj(body, 'name', 'email');

  const updated = await userDao.updateUserByUser({ id, ...filteredBody });

  return updated;
};

const deactivateUserByUser = async (id) => {

  const updated = await userDao.deactivateUserByUser(id);

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
    updateUserByAdmin,
    updateUserByUser,
    deleteOne,
    findOne,
    findAll,
    deactivateUserByUser
};
