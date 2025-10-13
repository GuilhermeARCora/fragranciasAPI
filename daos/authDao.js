const User = require('../models/user');

const signup = async (user) => {
    return await user.save();
};

const login = async (email) => {
    return await User.findOne({  email  }).select('+password');
};

module.exports = {
    signup,
    login
};