const Product = require('../models/product');

const createOne = async (obj) => {
    return await Product.create(obj);
};

const findOne = async (id) => {
    return await Product.findById(id);
};

const findAll = () =>{
    return Product.find()
};

const updatePatch = async ({ id, ...data }) => {
  
    return await Product.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true
    });
};

const deleteOne = async (id) => {
    return await Product.findByIdAndDelete(id);
};

module.exports = {
    createOne,
    updatePatch,
    deleteOne,
    findOne,
    findAll
}