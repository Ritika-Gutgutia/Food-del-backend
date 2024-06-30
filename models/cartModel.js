import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({});

const cartModel = mongoose.models.cart || mongoose.model("cart", cartSchema);

export default cartModel;
