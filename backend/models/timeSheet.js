import mongoose from "mongoose";

const timeSheetSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
  company: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
  date: { type: Date, required: true },
  hours: { type: Number, required: true },
  activity: { type: mongoose.Schema.Types.ObjectId, ref: "Activity" },
  oem: { type: mongoose.Schema.Types.ObjectId, ref: "OEM" },
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  client: { type: mongoose.Schema.Types.ObjectId, ref: "Client" },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const TimeSheet = mongoose.model("TimeSheet", timeSheetSchema);

export default TimeSheet;
