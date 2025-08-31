const User = require('../models/user');

const signup = async (user) => {
    return await user.save();
};

const login = async (email) => {
    return await User.findOne({  email  }).select('+password');
}

const logout = async() => {
    //not needed for now
};

module.exports = {
    signup,
    login,
    logout
};