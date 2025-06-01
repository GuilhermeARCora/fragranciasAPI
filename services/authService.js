const authDao = require('../daos/authDao');

const signup = async (reqBody) => {
    //logic if needed
    return await authDao.signup(reqBody);
};

module.exports = {
    signup
}