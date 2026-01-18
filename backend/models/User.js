import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  otp: String,
  verified: { type: Boolean, default: false }
});

export default mongoose.model("User", userSchema);
