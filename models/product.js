const {Schema, model} = require('mongoose');

const productSchema = new Schema({
        name:{
            type:String,
            required: true
        },
        price: Number,
        description: String,
        secretProduct: {
            type: Boolean,
            default: false
        },
        photo:{
            type: String,
            default : 'default.png'
        }
});

const Product = model('products', productSchema);

module.exports = Product;