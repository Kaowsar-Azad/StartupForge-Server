const express = require("express");
const router = express.Router();
const Stripe = require("stripe");
const Payment = require("../models/Payment");
const { verifyToken, verifyAdmin, verifyFounder } = require("../middleware/authMiddleware");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// POST /api/payments/create-checkout-session - Create Stripe Checkout session
router.post("/create-checkout-session", verifyToken, verifyFounder, async (req, res) => {
  try {
    const { email } = req.user;

    // Check if already paid
    const existingPayment = await Payment.findOne({
      user_email: email,
      payment_status: "success",
    });
    if (existingPayment) {
      return res.status(400).json({ message: "You have already upgraded to Premium" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "StartupForge Premium",
              description: "Unlock unlimited opportunity postings for your startup",
            },
            unit_amount: 1999, // $19.99
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.CLIENT_URL || "http://localhost:3000"}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL || "http://localhost:3000"}/dashboard/founder`,
      metadata: {
        user_email: email,
      },
    });

    res.json({ url: session.url, sessionId: session.id });
  } catch (error) {
    res.status(500).json({ message: "Failed to create checkout session", error: error.message });
  }
});

// POST /api/payments/confirm - Confirm payment after Stripe checkout success
router.post("/confirm", verifyToken, async (req, res) => {
  try {
    const { session_id } = req.body;
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status === "paid") {
      // Check if already saved
      const existing = await Payment.findOne({ transaction_id: session.id });
      if (existing) {
        return res.json({ message: "Payment already recorded", payment: existing });
      }

      const payment = new Payment({
        user_email: session.customer_email || session.metadata.user_email,
        amount: session.amount_total / 100,
        transaction_id: session.id,
        payment_status: "success",
        paid_at: new Date(),
      });

      const saved = await payment.save();
      res.json({ message: "Payment confirmed successfully", payment: saved });
    } else {
      res.status(400).json({ message: "Payment not completed" });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to confirm payment", error: error.message });
  }
});

// GET /api/payments - Get all transactions (Admin only)
router.get("/", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const payments = await Payment.find()
      .sort({ paid_at: -1 })
      .select("-__v");
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch transactions", error: error.message });
  }
});

// GET /api/payments/check/:email - Check if founder has paid premium
router.get("/check/:email", verifyToken, verifyFounder, async (req, res) => {
  try {
    const { email } = req.params;
    const payment = await Payment.findOne({
      user_email: email,
      payment_status: "success",
    });

    res.json({
      isPremium: !!payment,
      payment: payment || null,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to check payment status", error: error.message });
  }
});

module.exports = router;
