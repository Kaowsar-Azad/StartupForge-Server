import express from "express";
const router = express.Router();
import User from "../models/User.js";
import { verifyToken, verifyAdmin } from "../middleware/authMiddleware.js";

// GET /api/users - Get all users (Admin only)
router.get("/", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-__v");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users", error: error.message });
  }
});

// GET /api/users/:email - Get single user by email
router.get("/:email", verifyToken, async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email }).select("-__v");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user", error: error.message });
  }
});

// PUT /api/users/:email - Update user profile
router.put("/:email", verifyToken, async (req, res) => {
  try {
    const { email } = req.params;
    if (req.user.email !== email && req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden: Cannot update this user" });
    }

    const updates = req.body;
    const user = await User.findOneAndUpdate({ email }, updates, {
      new: true,
      runValidators: true,
    }).select("-__v");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to update user", error: error.message });
  }
});

// PATCH /api/users/block/:id - Block user (Admin only)
router.patch("/block/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(
      id,
      { isBlocked: true },
      { new: true, runValidators: true }
    ).select("-__v");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to block user", error: error.message });
  }
});

// PATCH /api/users/unblock/:id - Unblock user (Admin only)
router.patch("/unblock/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(
      id,
      { isBlocked: false },
      { new: true, runValidators: true }
    ).select("-__v");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to unblock user", error: error.message });
  }
});

export default router;
