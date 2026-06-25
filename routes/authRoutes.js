const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// POST /api/auth/jwt - Generate JWT token after Better Auth login
router.post("/jwt", async (req, res) => {
  const { email, role, name, image } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name: name || "Unknown User",
        email,
        image: image || "",
        role: role || "collaborator",
      });
    }

    if (user.isBlocked) {
      return res
        .clearCookie("token", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        })
        .status(403)
        .json({ message: "Your account has been blocked. Contact the administrator." });
    }

    if (role && user.role !== role) {
      user.role = role;
    }
    if (name && user.name !== name) {
      user.name = name;
    }
    if (image && user.image !== image) {
      user.image = image;
    }

    await user.save();

    const token = jwt.sign({ email, role: user.role }, process.env.JWT_SECRET, {
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
  } catch (error) {
    console.error("Failed to process JWT auth request:", error);
    res.status(500).json({ message: "Failed to authenticate user" });
  }
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
