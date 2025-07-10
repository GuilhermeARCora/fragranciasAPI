//Check if there is a repeated product in items, if so merge the repetead ones and update the final quantity
module.exports = function mergeItems(items) {
  const qtyByProduct = {};

  for (const item of items) {
    const key = item.product.toString();
    const qty = item.quantity ?? 1;        // quantity undefined or null → 1
    qtyByProduct[key] = (qtyByProduct[key] || 0) + qty;
  }

  return Object.entries(qtyByProduct).map(([product, quantity]) => ({
    product,
    quantity
  }));
};
