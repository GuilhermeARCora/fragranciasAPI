const { Schema, model } = require('mongoose');

const productSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Nome é obrigatório'],
    trim: true,
    unique: true
  },
  fullPrice: {
    type: Number,
    required: [true, 'Preco é obrigatório']
  },
  description: {
    type: String,
    trim: true
  },
  image: {
    type: String,
    trim: true,
    required: [true, 'Imagem é obrigatório'],
    unique: true
  },
  categories: {
    type: [String],
    required: [true, 'Categorias é obrigatório'],
    enum: ['aromatizadores', 'autoCuidado', 'casaEBemEstar']
  },
  active: {
    type: Boolean,
    default: true
  },
  promoPercentage: {
    type: Number, 
    default: 0
  },
  cod:{
    type: String,
    required:[true, 'Codigo é obrigatório'],
    unique: true
  }
}, {
  strict: true,
  collection: "products",
  timestamps: true,
  toJSON: { virtuals: true },
  id: false
});

productSchema.virtual('currentPrice').get(function () {
  if (this.promoPercentage && this.promoPercentage > 0) {
    const discount = this.promoPercentage / 100;
    return this.fullPrice * (1 - discount);
  }
  return this.fullPrice;
});

productSchema.virtual('pixPrice').get(function () {
  const discount = 5 / 100;
  return this.currentPrice * (1 - discount);
});

const Product = model('products', productSchema);

module.exports = Product;
