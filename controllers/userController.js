import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import transporter from "../config/mailer.js";
import dotenv from "dotenv";
dotenv.config();

// import userModel from "../models/userModel.js";

dotenv.config();

//logic for registering user
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  const user = await userModel.findOne({ email });
  if (user) {
    return res.status(400).send("User already exists");
  }

  if (!validator.isEmail(email)) {
    return res.json({ success: false, message: "Please enter a valid email" });
  }

  if (password.length < 8) {
    return res.json({
      success: false,
      message: "Please enter a strong password",
    });
  }

  //hashing our password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpires = new Date(Date.now() + 15 * 60 * 1000);

  const newUser = new userModel({
    name: name,
    email: email,
    password: hashedPassword,
    otp,
    otpExpires,
  });

  await newUser.save();

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Email Verification",
    texr: `Your OTP code is %{otp}. It will expire in 15 minutes.`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      return res.status(500).send("Error sending mail");
    }
    res
      .status(200)
      .send("Registration successful. Please check your email for the OTP");
  });
};

//logic for verifying user
const verifyUser = async (req, res) => {
  const { email, otp } = req.body;

  const user = await userModel.findOne({ email });
  if (!user) return res.status(400).send("User not found");
  if (user.isVerified) return res.status(400).send("User already verified");

  if (user.otp == otp && user.otpExpires > Date.now()) {
    user.isVerified = true;
    uset.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.status(200).send("User verified successfully");
  } else {
    res.status(400).send("Invalid or expired credential");
  }
};

export { registerUser, verifyUser };
