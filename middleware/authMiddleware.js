const { createRemoteJWKSet, jwtVerify } = require("jose");
const User = require("../models/User");

let JWKS;
const getJWKS = () => {
  if (!JWKS) {
    const jwksUrl = `${process.env.BETTER_AUTH_URL || "http://localhost:5000/api/auth/better-auth"}/jwks`;
    console.log("Initializing JWKS Set with URL:", jwksUrl);
    JWKS = createRemoteJWKSet(new URL(jwksUrl));
  }
  return JWKS;
};

// Verify JWT Token Middleware via JWKS
const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("verifyToken: Received Authorization header:", authHeader ? "Header Exists" : "No Header");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const { payload } = await jwtVerify(token, getJWKS());
    console.log("verifyToken: Decoded token email:", payload.email, "role:", payload.role);
    const user = await User.findOne({ email: payload.email });

    if (!user) {
      console.log("verifyToken: User not found in MongoDB for email:", payload.email);
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    console.log("verifyToken: User found in MongoDB. Email:", user.email, "Role in DB:", user.role);

    if (user.isBlocked) {
      return res
        .status(403)
        .json({ message: "Forbidden: Your account is blocked" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("verifyToken error:", error);
    return res.status(403).json({ message: "Forbidden: Invalid token", details: error.message });
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
  console.log("verifyFounder: req.user email:", req.user?.email, "role:", req.user?.role);
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
