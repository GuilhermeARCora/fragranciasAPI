const mongoose = require('mongoose');
const Product = require('../modals/product');

exports.createProduct = async (obj) => {
    return await Product.create(obj);
};