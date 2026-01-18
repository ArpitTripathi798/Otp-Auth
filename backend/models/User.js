import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
  otp: String,
  verified: { type: Boolean, default: false },
});

export default mongoose.model("User", userSchema);

