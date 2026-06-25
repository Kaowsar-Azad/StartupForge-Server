require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { connectDB, connectMongoClient } = require("./config/db");
const { createAuth } = require("./config/auth");


// Route imports
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const startupRoutes = require("./routes/startupRoutes");
const opportunityRoutes = require("./routes/opportunityRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// CORS Configuration
const corsOptions = {
  origin: [
    process.env.CLIENT_URL || "http://localhost:3000",
    "https://startupforge.vercel.app", 
    "https://startup-forge-client.vercel.app",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

// Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Database & Auth lazy initialization middleware
let isInitialized = false;
let authHandler;
const initPromise = (async () => {
  try {
    await connectDB();
    await connectMongoClient();
    const auth = await createAuth();
    if (auth) {
      const { toNodeHandler } = await import("better-auth/node");
      authHandler = toNodeHandler(auth);
    }
    isInitialized = true;
    console.log("StartupForge Server successfully initialized DB & Auth client");
  } catch (err) {
    console.error("StartupForge Server initialization error:", err.message);
  }
})();

app.use(async (req, res, next) => {
  try {
    if (!isInitialized) {
      await initPromise;
    }
    next();
  } catch (err) {
    next(err);
  }
});

app.all(/^\/api\/auth\/better-auth/, (req, res, next) => {
  if (!authHandler) {
    return res.status(503).json({ message: "Authentication service not ready" });
  }
  return authHandler(req, res, next);
});

// Health check route (moved after init middleware so it verifies DB connection too)
app.get("/", (req, res) => {
  res.json({ message: "🚀 StartupForge Server is running!", status: "OK", initialized: isInitialized });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/startups", startupRoutes);
app.use("/api/opportunities", opportunityRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/payments", paymentRoutes);

// Global 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Global Error handler
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.message);
  res.status(500).json({ message: "Internal Server Error", error: err.message });
});

if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 StartupForge Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;

