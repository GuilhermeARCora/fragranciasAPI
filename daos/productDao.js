const mongoose = require('mongoose');
const Product = require('../models/product');

exports.createProduct = async (obj) => {
    return await Product.create(obj);
};