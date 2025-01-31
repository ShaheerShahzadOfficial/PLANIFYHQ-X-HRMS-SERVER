import mongoose from "mongoose";

const AssesmentTypeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  status: { type: String, enum: ["active", "inactive"], default: "active" },
});

export default mongoose.model("AssesmentType", AssesmentTypeSchema);
    