import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendOTP } from "../config/mail.js";

export const signup = async (req, res) => {
  const { email, password } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000);

  const user = await User.create({
    email,
    password: bcrypt.hashSync(password, 10),
    otp
  });

  await sendOTP(email, otp);
  res.json({ message: "OTP sent" });
};

export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email });

  if (!user || user.otp !== otp)
    return res.status(400).json({ message: "Invalid OTP" });

  user.verified = true;
  user.otp = null;
  await user.save();

  res.json({ message: "Account verified" });
};

export const login = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user || !bcrypt.compareSync(req.body.password, user.password))
    return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.json({ token });
};
