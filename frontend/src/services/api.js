import axios from "axios";

const api = axios.create({
  baseURL: "https://otp-auth-ensn.onrender.com/api",
});

export default api;


