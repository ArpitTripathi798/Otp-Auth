import axios from "axios";

const api = axios.create({
  baseURL: "https://otp-auth-ensn.onrender.com/api/auth",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
