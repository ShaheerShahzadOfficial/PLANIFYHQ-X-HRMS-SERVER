import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  status: {
    type: String,
    required: true,
    default: "active",
    enum: ["active", "inactive"],
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Activity", activitySchema);