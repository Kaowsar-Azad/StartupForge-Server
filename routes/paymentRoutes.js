import express from "express";
const router = express.Router();
import Stripe from "stripe";
import Payment from "../models/Payment.js";
import User from "../models/User.js";
import { verifyToken, verifyAdmin, verifyFounder } from "../middleware/authMiddleware.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// POST /api/payments/create-checkout-session - Create Stripe Checkout session
router.post("/create-checkout-session", verifyToken, verifyFounder, async (req, res) => {
  try {
    const { email } = req.user;
    const { plan = "monthly" } = req.body;

    // Check if already premium in User collection
    const userDoc = await User.findOne({ email });
    if (userDoc && userDoc.plan === "premium") {
      return res.status(400).json({ message: "You have already upgraded to Premium" });
    }

    const priceId = plan === "yearly" ? process.env.STRIPE_YEARLY_PRICE_ID : process.env.STRIPE_MONTHLY_PRICE_ID;

    if (!priceId) {
      return res.status(400).json({ message: `Stripe Price ID for ${plan} plan is not configured in server environment variables.` });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      customer_email: email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.CLIENT_URL || "http://localhost:3000"}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL || "http://localhost:3000"}/dashboard/founder`,
      metadata: {
        user_email: email,
        plan: plan,
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
      const email = session.customer_email || session.metadata.user_email;

      // Check if already saved
      const existing = await Payment.findOne({ transaction_id: session.id });
      if (existing) {
        // Double check user plan is updated
        await User.findOneAndUpdate({ email }, { plan: "premium" });
        return res.json({ message: "Payment already recorded", payment: existing });
      }

      const payment = new Payment({
        user_email: email,
        amount: session.amount_total / 100,
        transaction_id: session.id,
        payment_status: "success",
        paid_at: new Date(),
      });

      const saved = await payment.save();
      
      // Set user's plan to premium in database
      await User.findOneAndUpdate({ email }, { plan: "premium" });

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
    const user = await User.findOne({ email });

    res.json({
      isPremium: user?.plan === "premium",
      payment: null,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to check payment status", error: error.message });
  }
});

export default router;
