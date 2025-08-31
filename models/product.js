const {Schema, model} = require('mongoose');

const productSchema = new Schema({
        name:{
            type:String,
            required: [true, 'Nome é obrigatório'],
            trim:true,
            unique:true
        },
        fullPrice: {
          type: Number,
          required:[true, 'Preco é obrigatorio']
        },
        description: {
          type: String,
          trim:true,
          required:[true, 'Description is required']
        },
        imageUrl:{
          type: String,
          trim:true,
          required: [true, 'ImageURL is required']
        },
        categories:[{
          type:String,
          require:[true, 'Categories is required'],
          enum:['aromatizadores', 'autoCuidado', 'CasaEBemEstar', 'novidades']
        }],
        active:{
            type: Boolean,
            default: true
        },
        isInPromo:{
          type: Boolean,
          default: false
        }
},{ 
  strict: true, 
  timestamps: true
});

productSchema.set('toJSON', {
  transform(doc, ret) {
    delete ret.__v;
    return ret;
  }
});

//utilizar recursos do mongoose para criar pixPrice e currentPrice

const Product = model('products', productSchema);

module.exports = Product;