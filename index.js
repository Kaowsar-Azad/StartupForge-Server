require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { connectDB, connectMongoClient } = require("./config/db");
const { createAuth } = require("./config/auth");
const { toNodeHandler } = require("better-auth/node");

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
    "https://startupforge.vercel.app", // Add your deployed client URL here
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

let authHandler;
app.all(/^\/api\/auth\/better-auth/, (req, res, next) => {
  if (!authHandler) {
    return res.status(503).json({ message: "Authentication service not ready" });
  }
  return authHandler(req, res, next);
});

// Health check route
app.get("/", (req, res) => {
  res.json({ message: "🚀 StartupForge Server is running!", status: "OK" });
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

const startServer = async () => {
  try {
    await connectDB();
    await connectMongoClient();
    const auth = createAuth();
    authHandler = toNodeHandler(auth);

    app.listen(PORT, () => {
      console.log(`🚀 StartupForge Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
