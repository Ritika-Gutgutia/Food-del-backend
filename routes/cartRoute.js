import express from "express";
import authMiddleware from "../middleware/auth.js";

import {
  addToCart,
  getFromCart,
  removeFromCart,
} from "../controllers/cartController.js";

const cartRouter = express.Router();

cartRouter.post("/add", authMiddleware, addToCart);
cartRouter.get("/get", authMiddleware, getFromCart);
cartRouter.post("/remove", authMiddleware, removeFromCart);

export default cartRouter;
