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

const resetPassword = async (hashedToken) =>{
    return await User.findOne({passwordResetToken:hashedToken, passwordResetExpires: {$gt: Date.now()}});
};

const updatePassword = async (id) => {
    return await User.findById(id).select('+password');
};

module.exports = {
    signup,
    login,
    forgotPassword,
    resetPassword,
    updatePassword
}