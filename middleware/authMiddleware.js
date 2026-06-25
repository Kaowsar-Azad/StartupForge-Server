const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Verify JWT Token Middleware
const verifyToken = async (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    if (user.isBlocked) {
      return res
        .clearCookie("token", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        })
        .status(403)
        .json({ message: "Forbidden: Your account is blocked" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Forbidden: Invalid token" });
  }
};

// Verify Admin Role Middleware
const verifyAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Forbidden: Admin access required" });
  }
  next();
};

// Verify Founder Role Middleware
const verifyFounder = (req, res, next) => {
  if (req.user?.role !== "founder" && req.user?.role !== "admin") {
    return res.status(403).json({ message: "Forbidden: Founder access required" });
  }
  next();
};

// Verify Collaborator Role Middleware
const verifyCollaborator = (req, res, next) => {
  if (req.user?.role !== "collaborator" && req.user?.role !== "admin") {
    return res.status(403).json({ message: "Forbidden: Collaborator access required" });
  }
  next();
};

module.exports = { verifyToken, verifyAdmin, verifyFounder, verifyCollaborator };
