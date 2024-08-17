import nodemailer from "nodemailer";

const mailSender = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // // import userModel from "../models/userModel.js";

  transporter.sendMail({
    from: {
      name: "Ritika Gutgutia",
      address: process.env.EMAIL_USER,
    },
    to: `${email}`,
    subject: "FoodMato OTP Verification", // Subject line
    text: `OTP is ${otp}`, // plain text body
  });
};

export default mailSender;
