import express from "express";
import { loginUser, registerUser } from "../controllers/userController.js";

const userRouter = express.Router();

//for registering an user
userRouter.post("/login", loginUser);

//for verifying an user
userRouter.post("/register", registerUser);

export default userRouter;
