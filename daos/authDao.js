const User = require('../models/user');

const signup = async (user) => {
    return await User.create(user);
};

const login = async (email) => {
    return await User.findOne({  email  }).select('+password');
}

const forgotPassword = async (email) =>{
    return await User.findOne({  email  });
};

const resetPassword = () =>{

};

module.exports = {
    signup,
    login,
    forgotPassword,
    resetPassword
}