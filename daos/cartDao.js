const Cart = require('../models/cart');

const createCart = async(userId, items) => {

    const cart = await Cart.create({
        user: userId,
        items
    })
    
    await cart.populate('items.product');

    return cart;
};

const getCart = async(userId) => {

    const cart = await Cart.findOne({user: userId}).populate('items.product');

    return cart;
};

const editCart = async(userId, items) => {

    const editedCart = await Cart.findOneAndUpdate(
        {user: userId},
        {$set:{items : items}},
        {
          new: true,
          upsert: true,          
          runValidators: true,  
        }
    );

    await editedCart.populate('items.product');
 
    return editedCart;
};

const clearCart = async(userId) => {

    const cart = await Cart.findOneAndUpdate(
        {user: userId},
        {$set:{items : []}},
        {
          new: true,          
          runValidators: true,  
        }
    );

    return cart;
};

module.exports = {
    createCart,
    getCart,
    editCart,
    clearCart
};