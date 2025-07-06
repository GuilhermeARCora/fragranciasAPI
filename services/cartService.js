const cartDao = require('../daos/cartDao');

const createCart = async(userId, reqBody) => {

    const ownerOfTheCart = userId;
    const {items} = reqBody;

    const cart = await cartDao.createCart(ownerOfTheCart, items);

    cart.populate('items.product');

    return cart;
};

// const getCart = async(userId) => {

// };

// const editCart = async(userId, reqBody) => {

// };

module.exports = {
    createCart,
    // getCart,
    // editCart
};