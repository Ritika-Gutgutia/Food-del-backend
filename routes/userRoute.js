import express from "express";
import {
  loginUser,
  registerUser,
  addEmail,
} from "../controllers/userController.js";

const userRouter = express.Router();

//for registering an user
userRouter.post("/login", loginUser);

//for verifying an user
userRouter.post("/register", registerUser);

userRouter.post("/sendOtp", addEmail);

export default userRouter;
