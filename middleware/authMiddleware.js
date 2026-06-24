const jwt = require("jsonwebtoken");

// Verify JWT Token Middleware
const verifyToken = (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
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
