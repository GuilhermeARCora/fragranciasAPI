const userService = require('../services/userService');
const catchAsync = require('../utils/catchAsync');

const getMe = (req, res) => {
  
  const user = req.user.toObject();

  delete user.__v;

  sendResponse(res, 200, "sucess",{
      data: {user}
  });    
  
};

const createOne = catchAsync(async (req,res,next) => {
  
  const created = await userService.createOne(req.body);

  sendResponse(res, 201, "sucess",{
      data: {created}
  }); 

});

const findOne = catchAsync(async (req,res,next) => {
  
  const found = await userService.findOne(req.params.id); 

  sendResponse(res, 200, "sucess",{
      data: {found}
  }); 

});

const findAll = catchAsync(async (req,res,next) => {
  
  const data = await userService.findAll(req.query);    

  sendResponse(res, 200, "sucess",{
      data: {
        results: data.length,
        data
      }
  }); 

});

const updateUserByAdmin = catchAsync(async (req,res,next) => {
  
  const updated = await userService.updateUserByAdmin(req.params.id, req.body); 

  sendResponse(res, 200, "sucess",{
      data: {updated}
  }); 

});

const updateUserByUser = catchAsync(async (req,res,next) => {
  
  const updatedUser = await userService.updateUserByUser(req.body, req.user); 

  sendResponse(res, 200, "sucess",{
      data: {updatedUser}
  }); 

});

const deactivateUserByUser = catchAsync(async (req,res,next) => {

  await userService.deactivateUserByUser(req.user.id); 

  sendResponse(res, 204, "sucess"); 

});

const deleteOne = catchAsync(async (req,res,next) =>{
  
  await userService.deleteOne(req.params.id);

  sendResponse(res, 204, "sucess");

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