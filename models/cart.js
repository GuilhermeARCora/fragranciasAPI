const {Schema, model, default: mongoose} = require('mongoose');

const cartSchema = new Schema({

    user:{
        type:mongoose.ObjectId,
        required:[true, 'Name is required']
    },
    items:[{
        product: {
            type: Types.ObjectId,
            ref: 'Product',     
            required: [true, 'Product is required']
        },
        quantity: {
            type: Number,
            required: [true, 'Quantity is required'],
            default: 1
        }
    }]

}, { strict: true });

const Cart = model('cart', cartSchema);

module.exports = Cart;