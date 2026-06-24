const express = require("express");
const router = express.Router();
const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");

// GET /api/users - Get all users (Admin only)
router.get("/", verifyToken, verifyAdmin, async (req, res) => {
  // TODO: Implement get all users
  res.json({ message: "Get all users" });
});

// GET /api/users/:email - Get single user by email
router.get("/:email", verifyToken, async (req, res) => {
  // TODO: Implement get user by email
  res.json({ message: "Get user by email" });
});

// PUT /api/users/:email - Update user profile
router.put("/:email", verifyToken, async (req, res) => {
  // TODO: Implement update user profile
  res.json({ message: "Update user profile" });
});

// PATCH /api/users/block/:id - Block user (Admin only)
router.patch("/block/:id", verifyToken, verifyAdmin, async (req, res) => {
  // TODO: Implement block user
  res.json({ message: "Block user" });
});

// PATCH /api/users/unblock/:id - Unblock user (Admin only)
router.patch("/unblock/:id", verifyToken, verifyAdmin, async (req, res) => {
  // TODO: Implement unblock user
  res.json({ message: "Unblock user" });
});

module.exports = router;
