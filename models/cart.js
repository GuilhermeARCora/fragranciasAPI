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
            required: [true, 'Product is required']
        },
        quantity: {
            type: Number,
            default: 1
        }
    }]

}, { strict: true });

cartSchema.set('toJSON', {
  transform(doc, ret) {
    delete ret.__v;
    return ret;
  }
});

const Cart = model('carts', cartSchema);

module.exports = Cart;