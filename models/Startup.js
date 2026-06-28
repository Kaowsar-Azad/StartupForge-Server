import mongoose from "mongoose";

const startupSchema = new mongoose.Schema(
  {
    startup_name: { type: String, required: true },
    logo: { type: String, required: true },
    industry: { type: String, required: true },
    description: { type: String, required: true },
    funding_stage: {
      type: String,
      enum: ["Idea/Pre-Seed", "Seed", "Series A+", "Bootstrapped"],
      required: true,
    },
    founder_email: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Startup", startupSchema);
