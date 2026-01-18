import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

/* 🔥 CORS – SIMPLE & SAFE */
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.options("*", cors());
app.use(express.json());

/* 🔥 MongoDB CONNECT */
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => {
    console.error("MongoDB error:", err.message);
    process.exit(1);
  });

/* ROUTES */
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Backend alive");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server running on", PORT);
});



