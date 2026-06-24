const express = require("express");
const router = express.Router();
const Startup = require("../models/Startup");
const { verifyToken, verifyFounder, verifyAdmin } = require("../middleware/authMiddleware");

// GET /api/startups - Get all approved startups (public)
router.get("/", async (req, res) => {
  try {
    const startups = await Startup.find({ status: "approved" })
      .sort({ createdAt: -1 })
      .select("-__v");
    res.json(startups);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch startups", error: error.message });
  }
});

// GET /api/startups/featured - Get featured startups for home page
router.get("/featured", async (req, res) => {
  try {
    const startups = await Startup.find({ status: "approved" })
      .sort({ createdAt: -1 })
      .limit(6)
      .select("-__v");
    res.json(startups);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch featured startups", error: error.message });
  }
});

// GET /api/startups/founder/:email - Get founder's startup
router.get("/founder/:email", verifyToken, verifyFounder, async (req, res) => {
  try {
    const { email } = req.params;
    const startup = await Startup.findOne({ founder_email: email }).select("-__v");
    if (!startup) {
      return res.status(404).json({ message: "No startup found for this founder" });
    }
    res.json(startup);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch startup", error: error.message });
  }
});

// GET /api/startups/:id - Get single startup details
router.get("/:id", async (req, res) => {
  try {
    const startup = await Startup.findById(req.params.id).select("-__v");
    if (!startup) {
      return res.status(404).json({ message: "Startup not found" });
    }
    res.json(startup);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch startup", error: error.message });
  }
});

// POST /api/startups - Create a new startup (Founder only)
router.post("/", verifyToken, verifyFounder, async (req, res) => {
  try {
    const { startup_name, logo, industry, description, funding_stage } = req.body;

    // Check if founder already has a startup
    const existingStartup = await Startup.findOne({ founder_email: req.user.email });
    if (existingStartup) {
      return res.status(400).json({ message: "You already have a startup registered" });
    }

    const startup = new Startup({
      startup_name,
      logo,
      industry,
      description,
      funding_stage,
      founder_email: req.user.email,
      status: "pending",
    });

    const savedStartup = await startup.save();
    res.status(201).json(savedStartup);
  } catch (error) {
    res.status(500).json({ message: "Failed to create startup", error: error.message });
  }
});

// PUT /api/startups/:id - Update startup (Founder only)
router.put("/:id", verifyToken, verifyFounder, async (req, res) => {
  try {
    const startup = await Startup.findById(req.params.id);
    if (!startup) {
      return res.status(404).json({ message: "Startup not found" });
    }
    if (startup.founder_email !== req.user.email && req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden: Not your startup" });
    }

    const updates = req.body;
    const updatedStartup = await Startup.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }).select("-__v");

    res.json(updatedStartup);
  } catch (error) {
    res.status(500).json({ message: "Failed to update startup", error: error.message });
  }
});

// DELETE /api/startups/:id - Delete startup (Founder or Admin)
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const startup = await Startup.findById(req.params.id);
    if (!startup) {
      return res.status(404).json({ message: "Startup not found" });
    }
    if (startup.founder_email !== req.user.email && req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden: Not authorized" });
    }

    await Startup.findByIdAndDelete(req.params.id);
    res.json({ message: "Startup deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete startup", error: error.message });
  }
});

// PATCH /api/startups/approve/:id - Approve startup (Admin only)
router.patch("/approve/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const startup = await Startup.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true, runValidators: true }
    ).select("-__v");

    if (!startup) {
      return res.status(404).json({ message: "Startup not found" });
    }
    res.json(startup);
  } catch (error) {
    res.status(500).json({ message: "Failed to approve startup", error: error.message });
  }
});

// PATCH /api/startups/reject/:id - Reject startup (Admin only)
router.patch("/reject/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const startup = await Startup.findByIdAndUpdate(
      req.params.id,
      { status: "rejected" },
      { new: true, runValidators: true }
    ).select("-__v");

    if (!startup) {
      return res.status(404).json({ message: "Startup not found" });
    }
    res.json(startup);
  } catch (error) {
    res.status(500).json({ message: "Failed to reject startup", error: error.message });
  }
});

// GET /api/startups/admin/all - Get all startups for Admin review
router.get("/admin/all", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const startups = await Startup.find()
      .sort({ createdAt: -1 })
      .select("-__v");
    res.json(startups);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch all startups", error: error.message });
  }
});

module.exports = router;
