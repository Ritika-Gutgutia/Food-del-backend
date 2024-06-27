import express from "express";
import { verifyUser, registerUser } from "../controllers/userController.js";

const userRouter = express.Router();

//for registering an user
userRouter.post("/register", registerUser);

//for verifying an user
userRouter.post("/verify", verifyUser);

export default userRouter;
