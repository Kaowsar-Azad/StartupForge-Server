const express = require("express");
const router = express.Router();
const { verifyToken, verifyFounder } = require("../middleware/authMiddleware");

// GET /api/opportunities - Get all opportunities (public)
// Supports: ?search=, ?work_type=, ?industry=, ?page=, ?limit=
router.get("/", async (req, res) => {
  // TODO: Implement with $regex search & $in filter + server-side pagination
  res.json({ message: "Get all opportunities with search, filter & pagination" });
});

// GET /api/opportunities/featured - Get featured opportunities for home page
router.get("/featured", async (req, res) => {
  // TODO: Implement get latest 6 opportunities
  res.json({ message: "Get featured opportunities" });
});

// GET /api/opportunities/:id - Get single opportunity details
router.get("/:id", async (req, res) => {
  // TODO: Implement get opportunity by ID
  res.json({ message: "Get opportunity by ID" });
});

// GET /api/opportunities/startup/:startup_id - Get opportunities by startup
router.get("/startup/:startup_id", verifyToken, verifyFounder, async (req, res) => {
  // TODO: Implement get opportunities by startup_id
  res.json({ message: "Get opportunities by startup ID" });
});

// POST /api/opportunities - Create a new opportunity (Founder only)
// Premium gate: Must have paid if already has 3+ opportunities
router.post("/", verifyToken, verifyFounder, async (req, res) => {
  // TODO: Implement create opportunity with premium check
  res.json({ message: "Create opportunity" });
});

// PUT /api/opportunities/:id - Update opportunity (Founder only)
router.put("/:id", verifyToken, verifyFounder, async (req, res) => {
  // TODO: Implement update opportunity
  res.json({ message: "Update opportunity" });
});

// DELETE /api/opportunities/:id - Delete opportunity (Founder only)
router.delete("/:id", verifyToken, verifyFounder, async (req, res) => {
  // TODO: Implement delete opportunity
  res.json({ message: "Delete opportunity" });
});

module.exports = router;
