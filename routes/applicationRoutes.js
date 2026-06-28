import express from "express";
const router = express.Router();
import Application from "../models/Application.js";
import Opportunity from "../models/Opportunity.js";
import Startup from "../models/Startup.js";
import { verifyToken, verifyFounder, verifyCollaborator } from "../middleware/authMiddleware.js";

// GET /api/applications - Get all applications for a founder's opportunities
router.get("/", verifyToken, verifyFounder, async (req, res) => {
  try {
    // Find the founder's startup
    const startup = await Startup.findOne({ founder_email: req.user.email });
    if (!startup) {
      return res.status(404).json({ message: "No startup found for this founder" });
    }

    // Find all opportunities for this startup
    const opportunities = await Opportunity.find({ startup_id: startup._id });
    const opportunityIds = opportunities.map((opp) => opp._id);

    // Find all applications for those opportunities
    const applications = await Application.find({
      opportunity_id: { $in: opportunityIds },
    })
      .populate("opportunity_id", "role_title required_skills work_type")
      .sort({ applied_at: -1 })
      .select("-__v");

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch applications", error: error.message });
  }
});

// GET /api/applications/my/:email - Get applications by applicant email
router.get("/my/:email", verifyToken, async (req, res) => {
  try {
    const { email } = req.params;
    // Only allow the user to see their own applications (or admin)
    if (req.user.email !== email && req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const applications = await Application.find({ applicant_email: email })
      .populate({
        path: "opportunity_id",
        select: "role_title required_skills work_type commitment_level deadline startup_id",
        populate: {
          path: "startup_id",
          select: "startup_name logo industry",
        },
      })
      .sort({ applied_at: -1 })
      .select("-__v");

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch applications", error: error.message });
  }
});

// POST /api/applications - Submit a new application (Collaborator)
router.post("/", verifyToken, async (req, res) => {
  try {
    const { opportunity_id, portfolio_link, motivation } = req.body;

    // Check if opportunity exists
    const opportunity = await Opportunity.findById(opportunity_id);
    if (!opportunity) {
      return res.status(404).json({ message: "Opportunity not found" });
    }

    // Check if already applied
    const existingApplication = await Application.findOne({
      opportunity_id,
      applicant_email: req.user.email,
    });
    if (existingApplication) {
      return res.status(400).json({ message: "You have already applied for this opportunity" });
    }

    const application = new Application({
      opportunity_id,
      applicant_email: req.user.email,
      portfolio_link: portfolio_link || "",
      motivation,
    });

    const saved = await application.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: "Failed to submit application", error: error.message });
  }
});

// PATCH /api/applications/accept/:id - Accept an application (Founder only)
router.patch("/accept/:id", verifyToken, verifyFounder, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    application.status = "accepted";
    await application.save();
    res.json(application);
  } catch (error) {
    res.status(500).json({ message: "Failed to accept application", error: error.message });
  }
});

// PATCH /api/applications/reject/:id - Reject an application (Founder only)
router.patch("/reject/:id", verifyToken, verifyFounder, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    application.status = "rejected";
    await application.save();
    res.json(application);
  } catch (error) {
    res.status(500).json({ message: "Failed to reject application", error: error.message });
  }
});

export default router;
