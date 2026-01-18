import { useState } from "react";
import "./AuthCard.css";
import API from "../services/api";

export default function AuthCard() {
  const [flip, setFlip] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);

  // SIGNUP → SEND OTP
  const handleSignup = async () => {
    try {
      await API.post("/signup", { email, password });
      alert("OTP sent to your email");
      setShowOtp(true);
    } catch (err) {
      alert(err.response?.data?.message || "Signup error");
    }
  };

  // VERIFY OTP
  const handleVerifyOtp = async () => {
    try {
      await API.post("/verify-otp", { email, otp });
      alert("Account verified successfully");
      setFlip(false);
      setShowOtp(false);
    } catch (err) {
      alert(err.response?.data?.message || "Invalid OTP");
    }
  };

  return (
    <div className="scene">
      <div className={`card ${flip ? "flipped" : ""}`}>

        {/* LOGIN */}
        <div className="card-face front">
          <h2>Login</h2>
          <input
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button>Login</button>
          <p onClick={() => setFlip(true)}>Create account</p>
        </div>

        {/* SIGNUP */}
        <div className="card-face back">
          <h2>Signup</h2>

          {!showOtp ? (
            <>
              <input
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <button onClick={handleSignup}>Send OTP</button>
            </>
          ) : (
            <>
              <input
                placeholder="Enter OTP"
                onChange={(e) => setOtp(e.target.value)}
              />
              <button onClick={handleVerifyOtp}>Verify OTP</button>
            </>
          )}

          <p onClick={() => setFlip(false)}>Already have account</p>
        </div>

      </div>
    </div>
  );
}

