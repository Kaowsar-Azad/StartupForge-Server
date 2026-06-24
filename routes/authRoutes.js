const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

// POST /api/auth/jwt - Generate JWT token after Better Auth login
router.post("/jwt", async (req, res) => {
  const { email, role } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }
  const token = jwt.sign({ email, role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  res
    .cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })
    .json({ success: true });
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
