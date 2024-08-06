import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    cartData: { type: Object, default: {} },
    // isVerified: { type: Boolean, default: false },
    otp: { type: String, required: false },
    // otpExpired: { type: Date, required: false },
  },
  { minimize: false }
);

const userModel = mongoose.models.user || mongoose.model("user", userSchema);
export default userModel;
