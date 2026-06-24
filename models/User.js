const mongoose = require("mongoose");

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
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema, "user");
