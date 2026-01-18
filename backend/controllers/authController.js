import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendOTP } from "../config/mail.js";

/* ================= SIGNUP ================= */
export const signup = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));

    let user = await User.findOne({ email });

    if (user && user.verified) {
      return res.status(400).json({ message: "User already exists" });
    }

    if (user) {
      user.otp = otp;
      await user.save();
    } else {
      await User.create({
        email,
        password: bcrypt.hashSync(password, 10),
        otp,
        verified: false,
      });
    }

    // 🔥 NON-BLOCKING EMAIL (NO CRASH)
    sendOTP(email, otp).catch(err =>
      console.error("OTP mail error:", err.message)
    );

    res.json({ message: "OTP sent" });

  } catch (err) {
    console.error("Signup error:", err.message);
    res.status(500).json({ message: "Signup failed" });
  }
};

/* ================= VERIFY OTP ================= */
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP required" });
    }

    const user = await User.findOne({ email });

    if (!user || user.otp !== String(otp)) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    user.verified = true;
    user.otp = null;
    await user.save();

    res.json({ message: "Account verified" });

  } catch (err) {
    console.error("Verify OTP error:", err.message);
    res.status(500).json({ message: "OTP verification failed" });
  }
};

/* ================= LOGIN ================= */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!user.verified) {
      return res.status(403).json({ message: "Account not verified" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token });

  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ message: "Login failed" });
  }
};
