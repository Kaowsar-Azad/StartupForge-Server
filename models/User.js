import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    image: { type: String, default: "" },
    role: {
      type: String,
      enum: ["founder", "collaborator", "admin"],
      default: "collaborator",
    },
    isBlocked: { type: Boolean, default: false },
    plan: { type: String, enum: ["free", "premium"], default: "free" },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema, "user");
