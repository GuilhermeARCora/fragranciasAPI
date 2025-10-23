const User = require('../models/user');

const signup = async (user) => user.save();

const login = async (email) => User.findOne({ email }).select('+password -createdAt -updatedAt -__v');

module.exports = {
  signup,
  login
};
