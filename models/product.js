const {Schema, model} = require('mongoose');

const productSchema = new Schema({
        name:{
            type:String,
            required: true,
            trim:true
        },
        price: Number,
        description: String,
        secretProduct: {
            type: Boolean,
            default: false
        },
        imageUrl:{
          type: String,
          required: true
        }
},{ strict: true });

productSchema.set('toJSON', {
  transform(doc, ret) {
    delete ret.__v;
    return ret;
  }
});

const Product = model('products', productSchema);

module.exports = Product;