import cartModel from "../models/cartModel.js";
import userModel from "../models/userModel.js";

//add to cart api
const addToCart = async (req, res) => {
  try {
    let userData = await userModel.findOne({ _id: req.body.userId });
    let cartData = await userData.cartData;

    if (!cartData[req.body.itemId]) {
      cartData[req.body.itemId] = 1;
    } else {
      cartData[req.body.itemId] += 1;
    }

    await userModel.findByIdAndUpdate(req.body.userId, { cartData });
    res.json({
      success: true,
      userMessage: "Added to cart",
    });
  } catch (error) {
    res.json({ success: true, userMessage: "Unable to add to cart" });
  }
};

//get cart api
const getFromCart = async (req, res) => {};

//remove from cart

const removeFromCart = async (req, res) => {
  try {
    let userData = await userModel.findOne({ _id: req.body.userId });
    //alternatively we can also use
    // findById(req.body.userId)

    const cartData = await userData.cartData;
    if (!cartData[req.body.itemId]) {
      return res.send({
        success: false,
        userMessage: "Item does not exist in the cart",
      });
    } else {
      cartData[req.body.itemId] -= 1;
    }

    await userModel.findByIdAndUpdate(req.body.userId, { cartData });
    res.json({
      success: "true",
      userMessage: "Removed from the cart",
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      userMessage: `Error in removing from cart -> ${error}`,
    });
  }
};

export { addToCart, getFromCart, removeFromCart };
