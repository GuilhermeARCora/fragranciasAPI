const User = require('../models/user');

const signup = async (user) => {
    return await User.create(user);
};

module.exports = {
    signup
}