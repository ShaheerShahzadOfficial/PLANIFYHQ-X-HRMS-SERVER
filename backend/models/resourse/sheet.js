import mongoose from "mongoose";

const sheetSchema = new mongoose.Schema({
  assetType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AssetType",
    required: true,
  },
  assessmentType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AssesmentType",
    required: true,
  },
  assessmentMode: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AssesmentMode",
    required: true,
  },
  delivery: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Delivery",
    required: true,
  },

  size: { type: String, required: true },
  quantity: { type: Number, required: true },
  days: { type: Number },
  weeks: { type: Number, required: true },
  months: { type: Number, required: true },
  resource: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resourse-Salary",
      required: true,
    },
  ],
  resourceWeeks: { type: Number, required: true },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Sheet = mongoose.model("Sheet", sheetSchema);

export default Sheet;
