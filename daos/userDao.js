const User = require('../models/user');

const createOne = async (obj) => {
    return await User.create(obj);
};

const findOne = async (id) => {
    return await User.findById(id);
};

const findAll = () =>{
    return User.find()
};

const updatePatch = async ({ id, ...data }) => {
  
    return await User.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true
    });
};

const deleteOne = async (id) => {
    return await User.findByIdAndDelete(id);
};

module.exports = {
    createOne,
    updatePatch,
    deleteOne,
    findOne,
    findAll
}