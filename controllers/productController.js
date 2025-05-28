const productService = require('../services/productService');

exports.createProduct = async (req, res) => {
  
    try {

    const product = await productService.createProduct(req.body);

    res.status(201).json({ 
        status: 'success', 
        data: { 
            product 
        } 
    });
  
    } catch (err) {

    res.status(400).json({ 
        status: 'fail', 
        message: err.message 
    });

    }

};
