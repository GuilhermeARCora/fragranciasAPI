const User = require('../models/user');

const signup = async (user) => {
  const createdUser = await user.save();
  const cleanUser = await User.findById(createdUser._id).select('-createdAt -updatedAt -__v');

  return cleanUser;
};

const login = async (email) => User.findOne({ email }).select('+password -createdAt -updatedAt -__v');

module.exports = {
  signup,
  login
};
