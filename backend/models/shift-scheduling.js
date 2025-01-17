import mongoose from "mongoose";

const shiftSchedulingSchema = new mongoose.Schema({
  name: String,
  description: String,

  startDate: Date,
  minStartTime: Date,
  maxStartTime: Date,

  endDate: Date,
  minEndTime: Date,
  maxEndTime: Date,

  

  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },
  for: {
    // employee ID
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  shiftID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Shift",
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  isDeleted: { type: Boolean, default: false },
});

const ShiftScheduling = mongoose.model(
  "ShiftScheduling",
  shiftSchedulingSchema
);

export default ShiftScheduling;
