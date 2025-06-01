const User = require('../models/user');

const signup = async (reqBody) => {
    return await User.create(reqBody);
};

module.exports = {
    signup
}