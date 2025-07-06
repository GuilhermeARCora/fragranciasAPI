const {Schema, model, default: mongoose} = require('mongoose');

const cartSchema = new Schema({

    user:{
        type:mongoose.ObjectId,
        required:[true, 'Name is required'],
        unique:true
    },
    items:[{
        product: {
            type: mongoose.ObjectId,
            ref: 'products',     
            required: [true, 'Product is required'],
            unique:true
        },
        quantity: {
            type: Number,
            default: 1
        }
    }]

}, { strict: true });

const Cart = model('cart', cartSchema);

module.exports = Cart;