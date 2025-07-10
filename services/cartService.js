const cartDao = require('../daos/cartDao');
const AppError = require('../utils/appError');
const mergeItems = require('../utils/mergeItems');

const createCart = async(userId, reqBody) => {

    const ownerOfTheCart = userId;
    const {items} = reqBody;

    if (!Array.isArray(items)) {
        throw new AppError('Items must be an array', 400);
    };

    const finalItems = mergeItems(items);

    const cart = await cartDao.createCart(ownerOfTheCart, finalItems);

    return cart;
};

const getCart = async(userId) => {

    const cart = await cartDao.getCart(userId);
    
    if(!cart) throw new AppError('This user has no items in the cart!', 404);

    return cart;
};

const editCart = async(userId, reqBody) => {

    const {items} = reqBody;

    const finalItems = mergeItems(items);

    const editedCart = await cartDao.editCart(userId, finalItems);

    if(!editedCart) throw new AppError('This user has no cart, please create one first!', 404);

    return editedCart;

};

const clearCart = async(userId) => {

    const cart = await cartDao.clearCart(userId);

    if(!cart) throw new AppError('This user has no cart, please create one first!', 404);

};

module.exports = {
    createCart,
    getCart,
    editCart,
    clearCart
};