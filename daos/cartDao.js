const Cart = require('../models/cart');

const createCart = async(userID, items) => {

    const cart = await Cart.create({
        user: userID,
        items
    });

    return cart;
};

// const getCart = async(userID) => {


// };

// const editCart = async(userID, items) => {

 
// };

module.exports = {
    createCart,
    // getCart,
    // editCart
};