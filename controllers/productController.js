const productService = require('../services/productService');
const catchAsync = require('../utils/catchAsync');

const createOne = catchAsync(async (req,res,next) => {
  
  const created = await productService.createOne(req.body);

  res.status(201).json({
    status: "success",
    data:{
        created
    }
  });

});

const findOne = catchAsync(async (req,res,next) => {
  
  const found = await productService.findOne(req.params.id); 

  res.status(200).json({
    status: "success",
    data:{
       found
    }
  });

});

const findAll = catchAsync(async (req,res,next) => {
  
  const data = await productService.findAll(req.query);    

  res.status(200).json({
    status: 'success',
    results: data.length,
    data: {
      data
    }
  });

});

const updatePatch = catchAsync(async (req,res,next) => {
  
  const updated = await productService.updatePatch(req.params.id, req.body); 

  res.status(200).json({
    status: "success",
    data:{
        updated
    }
  });

});

const deleteOne = catchAsync(async (req,res,next) =>{
  
  await productService.deleteOne(req.params.id);

  res.status(200).json({
      status:"success",
      data: null
  })

});

module.exports = {
    createOne,
    updatePatch,
    deleteOne,
    findOne,
    findAll
};