const mongoose = require('mongoose');
const  Schema  = require('mongoose');

const productSchema = new mongoose.Schema({
        name:{
            type:String,
            required: true
        },
        price: Number,
        description: String,
        secretProduct: {
            type: Boolean,
            default: false
        }
});

const Product = mongoose.model('products', productSchema);

module.exports = Product;