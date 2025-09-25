const Product = require('../models/product');

const createOneProduct = async(data) =>{

  const product = await Product.create(data);

  return product.toObject();
};

const getAllProducts = async (reqQuery) => {
  const filters = {};

  if (reqQuery.cod) filters.cod = Number(reqQuery.cod);
  

  if (reqQuery.promoPercentage) filters.promoPercentage = Number(reqQuery.promoPercentage);
  

  if (reqQuery.fullPrice) filters.fullPrice = Number(reqQuery.fullPrice);
  

  if (reqQuery.active !== undefined) filters.active = reqQuery.active === "true";
  

  if (reqQuery.categories) filters.categories = { $in: reqQuery.categories.split(",") };
  
  // 🔹 Se tiver name, usa Atlas Search
  if (reqQuery.name) {
    const pipeline = [
      {
        $search: {
          index: "productSearch",
          compound: {
            should: [
              {
                autocomplete: {
                  query: reqQuery.name,
                  path: "name",
                },
              }
            ],
          },
        },
      },
      { $match: filters }, // aplica os outros filtros num passo separado
    ];

    return await Product.aggregate(pipeline);
  }

  // 🔹 Caso contrário, busca normal
  const products = await Product.find(filters);
  return products.map((p) => p.toObject());
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

const changeStatus = async({id, ...updates}) =>{

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
  getProductsByCategory,
  changeStatus
};