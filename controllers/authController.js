const catchAsync = require('../utils/catchAsync');
const authService = require('../services/authService');
const sendResponse = require('../utils/sendResponse');

const signup = catchAsync(async (req,res,next) => {
    
    const {user, token} = await authService.signup(req.body, res,req);

    sendResponse(res, 201, "Cadastrado com sucesso",{
        token,
        user
    });
});

const login = catchAsync(async (req,res,next) => {

    const token = await authService.login(req.body, res);

    sendResponse(res,200,"Conectado com sucesso", token);
});

const logout = (req,res,next) => {

    // Overwrites the existing cookie
    res.cookie('jwt', '', {
        expires: new Date(Date.now() + 10 * 1000), // expires in 10s
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? "Strict" : "Lax"
    });

    sendResponse(res,200,'Desconectado com sucesso!',{});
};

const me = (req, res) => {
  
  const user = req.user.toObject();

  sendResponse(res, 200, "sucess", user);    
};

module.exports = {
    signup,
    login,
    logout,
    me
};