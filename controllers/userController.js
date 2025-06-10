const userService = require('../services/userService');
const catchAsync = require('../utils/catchAsync');

const getMe = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      user: req.user
    }
  });
};

const createOne = catchAsync(async (req,res,next) => {
  
  const created = await userService.createOne(req.body);

  res.status(201).json({
    status: "success",
    data:{
        created
    }
  });

});

const findOne = catchAsync(async (req,res,next) => {
  
  const found = await userService.findOne(req.params.id); 

  res.status(200).json({
    status: "success",
    data:{
       found
    }
  });

});

const findAll = catchAsync(async (req,res,next) => {
  
  const data = await userService.findAll(req.query);    

  res.status(200).json({
    status: 'success',
    results: data.length,
    data: {
      data
    }
  });

});

const updateUserByAdmin = catchAsync(async (req,res,next) => {
  
  const updated = await userService.updateUserByAdmin(req.params.id, req.body); 

  res.status(200).json({
    status: "success",
    data:{
        updated
    }
  });

});

const updateUserByUser = catchAsync(async (req,res,next) => {
  
  const updatedUser = await userService.updateUserByUser(req.body, req.user); 

  res.status(200).json({
    status: "success",
    data:{
        updatedUser
    }
  });

});

const deactivateUserByUser = catchAsync(async (req,res,next) => {

  const deletedUser = await userService.deactivateUserByUser(req.user.id); 

  res.status(204).json({
    status: "success",
    data: null
  });

});

const deleteOne = catchAsync(async (req,res,next) =>{
  
  await userService.deleteOne(req.params.id);

  res.status(204).json({
      status:"success",
      data: null
  })

});

module.exports = {
    getMe,
    createOne,
    updateUserByAdmin,
    updateUserByUser,
    deleteOne,
    findOne,
    findAll,
    deactivateUserByUser
};