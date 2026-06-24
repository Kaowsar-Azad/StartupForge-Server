const express = require("express");
const router = express.Router();
const { verifyToken, verifyFounder, verifyAdmin } = require("../middleware/authMiddleware");

// GET /api/startups - Get all startups (public)
router.get("/", async (req, res) => {
  // TODO: Implement get all approved startups
  res.json({ message: "Get all startups" });
});

// GET /api/startups/featured - Get featured startups for home page
router.get("/featured", async (req, res) => {
  // TODO: Implement get latest 6 startups
  res.json({ message: "Get featured startups" });
});

// GET /api/startups/:id - Get single startup details
router.get("/:id", async (req, res) => {
  // TODO: Implement get startup by ID
  res.json({ message: "Get startup by ID" });
});

// GET /api/startups/founder/:email - Get founder's startup
router.get("/founder/:email", verifyToken, verifyFounder, async (req, res) => {
  // TODO: Implement get startup by founder email
  res.json({ message: "Get startup by founder email" });
});

// POST /api/startups - Create a new startup (Founder only)
router.post("/", verifyToken, verifyFounder, async (req, res) => {
  // TODO: Implement create startup
  res.json({ message: "Create startup" });
});

// PUT /api/startups/:id - Update startup (Founder only)
router.put("/:id", verifyToken, verifyFounder, async (req, res) => {
  // TODO: Implement update startup
  res.json({ message: "Update startup" });
});

// DELETE /api/startups/:id - Delete startup (Founder or Admin)
router.delete("/:id", verifyToken, async (req, res) => {
  // TODO: Implement delete startup
  res.json({ message: "Delete startup" });
});

// PATCH /api/startups/approve/:id - Approve startup (Admin only)
router.patch("/approve/:id", verifyToken, verifyAdmin, async (req, res) => {
  // TODO: Implement approve startup
  res.json({ message: "Approve startup" });
});

// PATCH /api/startups/reject/:id - Reject startup (Admin only)
router.patch("/reject/:id", verifyToken, verifyAdmin, async (req, res) => {
  // TODO: Implement reject startup
  res.json({ message: "Reject startup" });
});

module.exports = router;
