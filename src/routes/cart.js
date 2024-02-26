const express=require('express');

const { addItemToCart, getCartItems, removeCartItems, increaseCartItemQuantity, decreaseCartItemQuantity } = require('../controllers/cart');
const { requireSignIn, userMiddleware } = require('../common-middleware');
const router=express.Router();

router.post('/user/addItemToCart', requireSignIn , userMiddleware , addItemToCart)
router.get('/user/getCartItems',requireSignIn , userMiddleware , getCartItems);
router.delete('/user/removeCartItems/:productId', requireSignIn , userMiddleware , removeCartItems)
router.post('/user/increaseCartItemQuantity', requireSignIn , userMiddleware , increaseCartItemQuantity)
router.post('/user/decreaseCartItemQuantity', requireSignIn , userMiddleware , decreaseCartItemQuantity)




module.exports = router;  