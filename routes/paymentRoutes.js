const express = require("express");
const router = express.Router();
const { verifyToken, verifyAdmin, verifyFounder } = require("../middleware/authMiddleware");

// POST /api/payments/create-checkout-session - Create Stripe Checkout session
router.post("/create-checkout-session", verifyToken, verifyFounder, async (req, res) => {
  // TODO: Implement Stripe checkout session creation
  res.json({ message: "Create Stripe checkout session" });
});

// POST /api/payments/webhook - Stripe webhook handler
router.post("/webhook", express.raw({ type: "application/json" }), async (req, res) => {
  // TODO: Implement Stripe webhook - save payment to DB on success
  res.json({ message: "Stripe webhook received" });
});

// GET /api/payments - Get all transactions (Admin only)
router.get("/", verifyToken, verifyAdmin, async (req, res) => {
  // TODO: Implement get all transactions
  res.json({ message: "Get all transactions" });
});

// GET /api/payments/check/:email - Check if founder has paid premium
router.get("/check/:email", verifyToken, verifyFounder, async (req, res) => {
  // TODO: Check premium payment status for founder
  res.json({ message: "Check premium payment status" });
});

module.exports = router;
