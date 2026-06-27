const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// POST /api/auth/jwt - Deprecated (Replaced by Better Auth token)
router.post("/jwt", (req, res) => {
  res.json({ success: true, message: "Deprecated. Use Better Auth get-token endpoint directly." });
});

// POST /api/auth/logout - Clear JWT cookie
router.post("/logout", (req, res) => {
  res
    .clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    })
    .json({ success: true, message: "Logged out successfully" });
});

module.exports = router;
