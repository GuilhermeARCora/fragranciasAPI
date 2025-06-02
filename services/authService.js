const authDao = require('../daos/authDao');

const signup = async (reqBody) => {

    const newUser = {
        name: reqBody.name,
        email:reqBody.email,
        password: reqBody.password
    };

    // Set the virtuals manually
    newUser.confirmPassword = reqBody.confirmPassword;
    newUser.confirmEmail = reqBody.confirmEmail;

    return await authDao.signup(newUser);
};

module.exports = {
    signup
}