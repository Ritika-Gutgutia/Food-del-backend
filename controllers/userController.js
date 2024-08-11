import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import mailSender from "../config/mailer.js";
import dotenv from "dotenv";

dotenv.config();

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.send({
        success: false,
        message: `User with email ${email} does not exist`,
      });
    }

    console.log(user);

    const isMatch = await bcrypt.compare(password, user.password);
    console.log(password, user.password);
    if (!isMatch) {
      return res.json({
        success: false,
        message: "Incorrect password",
      });
    }

    const token = createToken(user._id);

    return res.json({
      success: true,
      token,
    });
  } catch (error) {
    return res.json({
      success: false,
      message: "Unable to log in",
    });
  }
};

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};
// register user

const addEmail = async (req, res) => {
  try {
    let email = req.body.email;

    let digits = "0123456789";
    let OTP = "";
    let len = digits.length;

    for (let i = 0; i < 4; i++) {
      OTP += digits[Math.floor(Math.random() * len)];
    }

    const exists = await userModel.findOne({ email });

    if (exists) {
      return res.json({ success: false, message: "User already exists" });
    }

    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please enter a valid email",
      });
    }

    const newUser = await new userModel({
      email: email,
      otp: OTP,
    });

    await newUser.save();

    await mailSender(email, OTP);

    return res.json({
      success: "true",
      message: "OTP Sent successfully",
    });
  } catch (error) {
    console.log(error);
    return res.json({
      success: "false",
      message: "Error in sending OTP",
    });
  }
};

const registerUser = async (req, res) => {
  const { email, name, password, otp } = req.body;

  try {
    //validating email format and password
    const user = await userModel.findOne({ email: email });

    if (password.length < 8) {
      return res.send({
        success: false,
        message: "Please enter a strong password",
      });
    }

    // console.log(user[0].otp);
    console.log(user.otp);

    if (user.otp != otp) {
      await userModel.deleteOne({ email: email });
      return res.send({
        success: false,
        message: "Invalid OTP",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    user.name = name;
    user.password = hashedPassword;
    await user.save();
    const token = createToken(user._id);

    return res.json({
      success: true,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: "Error in registering userr" });
  }
};

export { loginUser, registerUser, addEmail };
