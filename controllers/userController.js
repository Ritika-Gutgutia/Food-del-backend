import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import transporter from "../config/mailer.js";
import nodemailer from "nodemailer";
import { google } from "googleapis";
import { oauth2 } from "googleapis/build/src/apis/oauth2/index.js";

// import userModel from "../models/userModel.js";

//logic for registering user
// const registerUser = async (req, res) => {
//   const { name, email, password } = req.body;
//   console.log(name, email, password);
//   const user = await userModel.findOne({ email });
//   if (user) {
//     return res.status(400).send("User already exists");
//   }

//   if (!validator.isEmail(email)) {
//     return res.json({ success: false, message: "Please enter a valid email" });
//   }

//   if (password.length < 8) {
//     return res.json({
//       s: false,
//       message: "Please enter a strong password",
//     });
//   }

//   //hashing our password
//   const salt = await bcrypt.genSalt(10);
//   const hashedPassword = await bcrypt.hash(password, salt);
//   const otp = Math.floor(100000 + Math.random() * 900000).toString();
//   const otpExpires = new Date(Date.now() + 15 * 60 * 1000);

//   const newUser = new userModel({
//     name: name,
//     email: email,
//     password: hashedPassword,
//     otp,
//     otpExpires,
//   });

//   await newUser.save();

//   // const transporter = nodemailer.createTransport({
//   //   service: "gmail",
//   //   auth: {
//   //     user: process.env.EMAIL_USER,
//   //     pass: process.user.EMAIL_PASS,
//   //   },
//   // });

//   // const mailOptions = {
//   //   from: process.env.EMAIL_USER,
//   //   to: email,
//   //   subject: "Email Verification",
//   //   text: `Your OTP code is %{otp}. It will expire in 15 minutes.`,
//   // };

//   // transporter.sendMail(mailOptions, (error, info) => {
//   //   if (error) {
//   //     console.log(error);
//   //     return res.status(500).send("Error sending mail");
//   //   }
//   //   res
//   //     .status(200)
//   //     .send("Registration successful. Please check your email for the OTP");
//   // });

//   const OAuth2 = google.auth.OAuth2;

//   const oauth2Client = new OAuth2(
//     process.env.CLIENT_ID,
//     process.env.CLIENT_SECRET,
//     "https://developers.google.com/oauthplayground"
//   );

//   oauth2Client.setCredentials({
//     refresh_token: process.env.REFRESH_TOKEN,
//   });

//   try {
//     const accessToken = await oauth2Client.getAccessToken();
//     if (!accessToken.token) {
//       throw new Error("Failed to retrieve access token");
//     }
//     let transporter = nodemailer.createTransport({
//       service: "Gmail",
//       auth: {
//         type: "OAuth2",
//         user: process.env.EMAIL_USER,
//         clientId: process.env.CLIENT_ID,
//         clientSecret: process.env.CLIENT_SECRET,
//         refreshToken: process.env.REFRESH_TOKEN,
//         accessToken: accessToken.token,
//       },
//     });

//     let mailOptions = {
//       from: process.env.EMAIL_USER,
//       to: email,
//       subject: "Email Verification",
//       text: `Your OTP code is %{otp}. It will expire in 15 minutes.`,
//     };

//     let info = await transporter.sendMail(mailOptions);
//     console.log("Email sent : " + info.response);
//   } catch (error) {
//     console.error("Error sending mail", error.message);
//   }

//   res.status(200).send({
//     s: true,
//     usermessage: "user registered",
//   });
// };

// //logic for verifying user
// const verifyUser = async (req, res) => {
//   const { email, otp } = req.body;

//   const user = await userModel.findOne({ email });
//   if (!user) return res.status(400).send("User not found");
//   if (user.isVerified) return res.status(400).send("User already verified");

//   if (user.otp == otp && user.otpExpires > Date.now()) {
//     user.isVerified = true;
//     uset.otp = undefined;
//     user.otpExpires = undefined;
//     await user.save();

//     res.status(200).send("User verified successfully");
//   } else {
//     res.status(400).send("Invalid or expired credential");
//   }
// };

// login user

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.send({
        success: false,
        userMessage: `User with email ${email} does not exist`,
      });
    }

    const isMatch = bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({
        success: "false",
        usserMessage: "Invalid credentials",
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
      userMessage: "Unable to log in",
    });
  }
};

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};
// register user

const registerUser = async (req, res) => {
  const { name, password, email } = req.body;

  try {
    //checking if user already exists
    const exists = await userModel.findOne({ email });

    if (exists) {
      return res.json({ success: false, userMessage: "User already exists" });
    }

    //validating email format and password

    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        userMessage: "Please enter a valid email",
      });
    }

    if (password.length < 8) {
      return res.send({
        success: false,
        userMessage: "Please enter a strong password",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name: name,
      email: email,
      password: hashedPassword,
      //cartData is by default empty only
    });

    const user = await newUser.save();

    const token = createToken(user._id);

    res.json({
      success: true,
      token,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, userMessage: "Error in registering" });
  }
};

export { loginUser, registerUser };
