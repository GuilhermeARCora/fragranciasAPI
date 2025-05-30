const User = require('../models/user');

const createUser = async (obj) => {
    return await User.create(obj);
};

const findUser = async (id) => {
    return await User.findById(id);
};

const updateUser = async ({ id, ...data }) => {
  
    return await User.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true
    });
};

const deleteUser = async (id) => {
    return await User.findByIdAndDelete(id);
};

module.exports = {
    createUser,
    updateUser,
    deleteUser,
    findUser
}