import mongoose from "mongoose";

const oemSchema = new mongoose.Schema({
  name: String,
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ["active", "completed"], default: "active" },
});

const OEM = mongoose.model("OEM", oemSchema);

export default OEM;
