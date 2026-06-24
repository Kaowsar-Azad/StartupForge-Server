const express = require("express");
const router = express.Router();
const { verifyToken, verifyFounder } = require("../middleware/authMiddleware");

// GET /api/applications - Get all applications for a founder's opportunities
router.get("/", verifyToken, verifyFounder, async (req, res) => {
  // TODO: Implement get all applications for founder
  res.json({ message: "Get all applications for founder" });
});

// GET /api/applications/my/:email - Get applications by applicant email
router.get("/my/:email", verifyToken, async (req, res) => {
  // TODO: Implement get applications by applicant email
  res.json({ message: "Get my applications" });
});

// POST /api/applications - Submit a new application (Collaborator)
router.post("/", verifyToken, async (req, res) => {
  // TODO: Implement submit application
  res.json({ message: "Submit application" });
});

// PATCH /api/applications/accept/:id - Accept an application (Founder only)
router.patch("/accept/:id", verifyToken, verifyFounder, async (req, res) => {
  // TODO: Implement accept application
  res.json({ message: "Accept application" });
});

// PATCH /api/applications/reject/:id - Reject an application (Founder only)
router.patch("/reject/:id", verifyToken, verifyFounder, async (req, res) => {
  // TODO: Implement reject application
  res.json({ message: "Reject application" });
});

module.exports = router;
