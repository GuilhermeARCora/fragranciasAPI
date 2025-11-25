const { Schema, model } = require('mongoose');
const dayjs = require('dayjs');

const itemSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  name: String,
  fullPrice: Number,
  promoPercentage: Number,
  amount: Number,
  image: String
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  id: false,
  _id: false
});

itemSchema.virtual('currentPrice').get(function () {
  if (this.promoPercentage && this.promoPercentage > 0) {
    const discount = this.promoPercentage / 100;
    return this.fullPrice * (1 - discount);
  }
  return this.fullPrice;
});

const orderSchema = new Schema({
  items: [itemSchema],
  status: {
    type: String,
    trim: true,
    enum: ['PENDENTE', 'CONCLUIDO', 'CANCELADO'],
    default: 'PENDENTE'
  }
}, {
  strict: true,
  collection: 'orders',
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  id: false
});

orderSchema.virtual('totalUnits').get(function () {
  if (!this.items || this.items.length === 0) return 0;

  const totalUnits = this.items.reduce((acc, item) => acc + (item.amount || 0), 0);

  return totalUnits;
});

orderSchema.virtual('totalFullPrice').get(function () {
  if (!this.items || this.items.length === 0) return 0;

  const totalFullPrice = this.items.reduce((acc, item) => acc + (item.fullPrice * item.amount), 0);

  return totalFullPrice;
});

orderSchema.virtual('totalCurrentPrice').get(function () {
  if (!this.items || this.items.length === 0) return 0;

  const totalCurrentPrice = this.items.reduce((acc, item) => {
    const discount = item.promoPercentage ? item.promoPercentage / 100 : 0;
    const currentPrice = item.fullPrice * (1 - discount);
    return acc + (currentPrice * item.amount);
  }, 0);

  return totalCurrentPrice;
});

orderSchema.virtual('totalDiscount').get(function () {
  if (!this.items || this.items.length === 0) return 0;

  const totalDiscount = this.items.reduce((acc, item) => {
    const discount = item.promoPercentage ? item.promoPercentage / 100 : 0;
    const currentPrice = item.fullPrice * (1 - discount);
    const totalDiscountInThisItem = ((item.fullPrice - currentPrice) * item.amount);

    return acc + totalDiscountInThisItem;
  }, 0);

  return totalDiscount;
});

orderSchema.virtual('totalPixPrice').get(function () {
  if (!this.items || this.items.length === 0) return 0;

  const totalPixPrice = this.items.reduce((acc, item) => {
    const discount = item.promoPercentage ? item.promoPercentage / 100 : 0;
    const currentPrice = item.fullPrice * (1 - discount);
    const pixPrice = currentPrice * (1 - 0.05) * item.amount;

    return acc + pixPrice;
  }, 0);
  return totalPixPrice;
});

orderSchema.virtual('dayItWasIssued').get(function () {
  if (!this.createdAt) return null;

  // Exemplo: "18/10/2025 14:30"
  return dayjs(this.createdAt).format('DD/MM/YYYY HH:mm');
});

const Order = model('orders', orderSchema);

module.exports = Order;
