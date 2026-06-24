const express = require("express");
const router = express.Router();
const Opportunity = require("../models/Opportunity");
const Startup = require("../models/Startup");
const Payment = require("../models/Payment");
const { verifyToken, verifyFounder } = require("../middleware/authMiddleware");

// GET /api/opportunities - Get all opportunities (public)
// Supports: ?search=, ?work_type=, ?industry=, ?page=, ?limit=
router.get("/", async (req, res) => {
  try {
    const { search, work_type, industry, page = 1, limit = 9 } = req.query;
    const filter = {};

    // $regex search — searches role_title and required_skills
    if (search) {
      filter.$or = [
        { role_title: { $regex: search, $options: "i" } },
        { required_skills: { $regex: search, $options: "i" } },
      ];
    }

    // $in filter — Work Type
    if (work_type) {
      const types = work_type.split(",");
      filter.work_type = { $in: types };
    }

    // Populate startup info for industry filter
    const skip = (parseInt(page) - 1) * parseInt(limit);

    let opportunities = await Opportunity.find(filter)
      .populate("startup_id", "startup_name logo industry founder_email status")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select("-__v");

    // Filter by industry (from populated startup)
    if (industry) {
      const industries = industry.split(",");
      opportunities = opportunities.filter(
        (opp) => opp.startup_id && industries.includes(opp.startup_id.industry)
      );
    }

    // Only return opportunities whose startup is approved
    opportunities = opportunities.filter(
      (opp) => opp.startup_id && opp.startup_id.status === "approved"
    );

    const total = await Opportunity.countDocuments(filter);

    res.json({
      opportunities,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch opportunities", error: error.message });
  }
});

// GET /api/opportunities/featured - Get featured opportunities for home page
router.get("/featured", async (req, res) => {
  try {
    const opportunities = await Opportunity.find()
      .populate("startup_id", "startup_name logo industry status")
      .sort({ createdAt: -1 })
      .limit(6)
      .select("-__v");

    // Only return opportunities from approved startups
    const filtered = opportunities.filter(
      (opp) => opp.startup_id && opp.startup_id.status === "approved"
    );

    // Map to add startup_name to root level for frontend convenience
    const result = filtered.map((opp) => ({
      ...opp.toObject(),
      startup_name: opp.startup_id?.startup_name || "Unknown",
    }));

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch featured opportunities", error: error.message });
  }
});

// GET /api/opportunities/startup/:startup_id - Get opportunities by startup
router.get("/startup/:startup_id", verifyToken, verifyFounder, async (req, res) => {
  try {
    const opportunities = await Opportunity.find({ startup_id: req.params.startup_id })
      .sort({ createdAt: -1 })
      .select("-__v");
    res.json(opportunities);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch opportunities", error: error.message });
  }
});

// GET /api/opportunities/:id - Get single opportunity details
router.get("/:id", async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id)
      .populate("startup_id", "startup_name logo industry description founder_email funding_stage")
      .select("-__v");

    if (!opportunity) {
      return res.status(404).json({ message: "Opportunity not found" });
    }
    res.json(opportunity);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch opportunity", error: error.message });
  }
});

// POST /api/opportunities - Create a new opportunity (Founder only)
// Premium gate: Must have paid if already has 3+ opportunities
router.post("/", verifyToken, verifyFounder, async (req, res) => {
  try {
    const { startup_id, role_title, required_skills, work_type, commitment_level, deadline } = req.body;

    // Check if founder's startup exists
    const startup = await Startup.findById(startup_id);
    if (!startup || startup.founder_email !== req.user.email) {
      return res.status(403).json({ message: "Forbidden: Not your startup" });
    }

    // Premium gate: check if founder already has 3 opportunities
    const existingCount = await Opportunity.countDocuments({ startup_id });
    if (existingCount >= 3) {
      // Check if founder has paid
      const payment = await Payment.findOne({
        user_email: req.user.email,
        payment_status: "success",
      });
      if (!payment) {
        return res.status(402).json({
          message: "You have reached the free limit (3 opportunities). Please upgrade to Premium to post more.",
          requiresPayment: true,
        });
      }
    }

    const opportunity = new Opportunity({
      startup_id,
      role_title,
      required_skills,
      work_type,
      commitment_level,
      deadline,
    });

    const saved = await opportunity.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: "Failed to create opportunity", error: error.message });
  }
});

// PUT /api/opportunities/:id - Update opportunity (Founder only)
router.put("/:id", verifyToken, verifyFounder, async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id).populate("startup_id", "founder_email");
    if (!opportunity) {
      return res.status(404).json({ message: "Opportunity not found" });
    }
    if (opportunity.startup_id?.founder_email !== req.user.email && req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden: Not your opportunity" });
    }

    const updates = req.body;
    const updated = await Opportunity.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }).select("-__v");

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to update opportunity", error: error.message });
  }
});

// DELETE /api/opportunities/:id - Delete opportunity (Founder only)
router.delete("/:id", verifyToken, verifyFounder, async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id).populate("startup_id", "founder_email");
    if (!opportunity) {
      return res.status(404).json({ message: "Opportunity not found" });
    }
    if (opportunity.startup_id?.founder_email !== req.user.email && req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden: Not your opportunity" });
    }

    await Opportunity.findByIdAndDelete(req.params.id);
    res.json({ message: "Opportunity deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete opportunity", error: error.message });
  }
});

module.exports = router;
