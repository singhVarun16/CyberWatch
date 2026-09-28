import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import authRoutes from "./routes/authRoutes.js";
import complaintRoutes from "./routes/complaintRoutes.js";
import blacklistRoutes from "./routes/blacklistRoutes.js";

const app = express();

const PORT = 3000;

const DB_URL = "mongodb://127.0.0.1:27017/cyberwatch";

// =======================
// Middleware
// =======================

app.use(cors());
app.use(express.json());

// =======================
// MongoDB Connection
// =======================

mongoose
  .connect(DB_URL)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.log("MongoDB connection error:", err);
  });

// =======================
// HOME ROUTE
// =======================

app.get("/", (req, res) => {
  res.send("CyberWatch backend is running!");
});

// =======================
// API ROUTES
// =======================

app.use("/api", authRoutes);

app.use("/api/complaints", complaintRoutes);

app.use("/api/blacklist", blacklistRoutes);

// =======================
// START SERVER
// =======================

app.listen(PORT, () => {
  console.log(
    `CyberWatch backend running on http://localhost:${PORT}`
  );
});