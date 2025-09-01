const Product = require('../models/product');

const createOneProduct = async(data) =>{

  const product = await Product.create(data);

  return product.toObject();
};

const getAllProducts = async() =>{

  const products = await Product.find();

  return products.map(p => p.toObject());
};

const getProductsByCategory = async(category, limit, page) =>{

  const skip = (page - 1) * limit;
  const products = await Product.find({ categories: category })
    .skip(skip)
    .limit(limit);

  return products.map(p => p.toObject());
};

const getOneProduct = async(id) =>{

  const product = await Product.findById(id);

  return product.toObject();
};

const getNovidades = async() =>{

  const products = await Product.find().sort({ createdAt: -1 }).limit(10);

  return products.map(p => p.toObject());
};

const searchAutoComplete = async(query) =>{

  return await Product.aggregate([
    {
      $search: {
        index: 'productSearch',
        compound: {
          should: [
            {
              autocomplete: {
                query,
                path: 'name'
              }
            },
            {
              autocomplete: {
                query,
                path: 'description'
              }
            }
          ]
        }
      }
    },
    { $limit: 10 }
  ]);

};

const editOneProduct = async({id, ...updates}) =>{

  const product = await Product.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true
    });

  return product.toObject();
};

const deleteOneProduct = async(id) =>{

  const deleted = await Product.findByIdAndDelete(id);

  return deleted.toObject();
};

module.exports = {
  createOneProduct,
  getAllProducts,
  getOneProduct,
  editOneProduct,
  deleteOneProduct,
  getNovidades,
  searchAutoComplete,
  getProductsByCategory
};