const {Schema, model} = require('mongoose');

const productSchema = new Schema({
        name:{
            type:String,
            required: [true, 'Name is required'],
            trim:true,
            unique:true
        },
        price: {
          type: String,
          required:[true, 'Price is required']
        },
        description: {
          type: String,
          trim:true,
          required:[true, 'Description is required']
        },
        secretProduct: {
            type: Boolean,
            default: false,
            select:false
        },
        imageUrl:{
          type: String,
          trim:true,
          required: [true, 'ImageURL is required']
        },
        categories:[{
          type:String,
          require:[true, 'Categories is required'],
          enum:['a','b','c','d']
        }]
},{ strict: true });

productSchema.set('toJSON', {
  transform(doc, ret) {
    delete ret.__v;
    return ret;
  }
});

const Product = model('products', productSchema);

module.exports = Product;