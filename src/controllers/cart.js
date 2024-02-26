const Cart = require("../models/cart");
const mongoose = require('mongoose');


function runUpdate(condition, updateData) {
  return new Promise((resolve, reject) => {
    //you update code here

    Cart.findOneAndUpdate(condition, updateData, { upsert: true })
      .then((result) => resolve())
      .catch((err) => reject(err));
  });
} 

exports.addItemToCart = async (req, res) => {
  try {
    const { cartItem } = req.body;

    if (!Array.isArray(cartItem)) {
      return res.status(400).json({ error: 'cartItem should be an array' });
    }

    const cart = await Cart.findOne({ user: req.user._id });

    if (cart) {
      // If cart already exists, update the cart
      cartItem.forEach((newCartItem) => {
        const existingCartItem = cart.cartItems.find((c) => c.name === newCartItem.name && c.size === newCartItem.size && c.design === newCartItem.design);

        if (existingCartItem) {
          // If the item already exists in the cart, update its quantity
          existingCartItem.quantity += newCartItem.quantity;
        } else {
          // If the item is not in the cart, push it to the cartItems array
          cart.cartItems.push(newCartItem);
        }
      });

      const updatedCart = await cart.save();
      res.status(201).json({ message: 'Cart updated successfully', cart: updatedCart });
    } else {
      // If cart does not exist, create a new cart
      const newCart = new Cart({
        user: req.user._id,
        cartItems: cartItem,
      });

      const savedCart = await newCart.save();
      if (savedCart) {
        return res.status(201).json({ message: 'Cart created successfully', cart: savedCart });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

  



// exports.addToCart = (req, res) => {
//     const { cartItems } = req.body;
//     if(cartItems){
//        if(Object.keys(cartItems).length > 0){
//            Cart.findOneAndUpdate({
//                "user": req.user._id
//            }, {
//                "cartItems": cartItems
//            }, {
//                 upsert: true, new: true, setDefaultsOnInsert: true
//            }, (error, cartItems) => {
//                if(error) return res.status(400).json({ error });
//                if(cartItems) res.status(201).json({ message: 'Added Successfully' });
//            })
//        }
//        //res.status(201).json({ cartItems });
//     }else{
//         //res.status(201).json({ req });
//     }
// }

exports.getCartItems = async(req, res) => {
  //const { user } = req.body.payload;
 // if(user){
    //.populate("cartItems.product", "_id name price productPictures")
    try {
      const cartItems = await Cart.findOne({ user: req.user._id })
      res.json(cartItems);
    } catch (err) {
      res.status(500).json({ error: 'Unable to fetch cart items' });
    }
 // }
};



const { ObjectId } = require('bson'); // Import ObjectId from BSON

exports.removeCartItems = (req, res) => {
    const { productId } = req.params;
    
    // Check if productId is a valid ObjectId
    if (!ObjectId.isValid(productId)) {
        return res.status(400).json({ error: 'Invalid productId' });
    }

    // Convert productId to ObjectId
    const objectId = new ObjectId(productId);

    // Remove the product from the cart based on productId
    Cart.updateOne(
        { user: req.user._id },
        {
            $pull: {
                cartItems: {
                    _id: objectId,
                },
            },
        }
    )
    .exec()
    .then((result) => {
        if (result) {
            res.status(202).json({ result });
        } else {
            res.status(400).json({ error: 'Error removing item from cart' });
        }
    })
    .catch((error) => {
        console.error('Error removing item from cart:', error);
        res.status(500).json({ error: 'Internal server error' });
    });
};
// Function to increase the quantity of an item in the cart
exports.increaseCartItemQuantity = async (req, res) => {
  const { productId } = req.body;

  if (!productId) {
    return res.status(400).json({ error: 'productId is missing in the request body' });
  }

  try {
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    const cartItem = cart.cartItems.find((item) => item._id.toString() === productId);

    if (!cartItem) {
      return res.status(404).json({ error: 'CartItem not found in the cart' });
    }

    // Increase the quantity of the cart item
    cartItem.quantity += 1;

    // Save the updated cart
    const updatedCart = await cart.save();
    res.status(202).json({ message: 'Cart item quantity increased successfully', cart: updatedCart });
  } catch (error) {
    console.error("Error increasing cart item quantity:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Function to decrease the quantity of an item in the cart
exports.decreaseCartItemQuantity = async (req, res) => {
  const { productId } = req.body;

  if (!productId) {
    return res.status(400).json({ error: 'productId is missing in the request body' });
  }

  try {
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    const cartItem = cart.cartItems.find((item) => item._id.toString() === productId);

    if (!cartItem) {
      return res.status(404).json({ error: 'CartItem not found in the cart' });
    }

    // Decrease the quantity of the cart item, ensuring it doesn't go below 1
    if (cartItem.quantity > 1) {
      cartItem.quantity -= 1;
    }

    // Save the updated cart
    const updatedCart = await cart.save();
    res.status(202).json({ message: 'Cart item quantity decreased successfully', cart: updatedCart });
  } catch (error) {
    console.error("Error decreasing cart item quantity:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


