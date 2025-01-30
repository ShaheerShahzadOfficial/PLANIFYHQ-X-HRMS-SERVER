import mongoose from "mongoose";

const shiftSchedulingSchema = new mongoose.Schema({
  title: String,
  startTime: Date,
  maxStartTime: Date,
  endTime: Date,
  minEndTime: Date,

  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const ShiftScheduling = mongoose.model(
  "ShiftScheduling",
  shiftSchedulingSchema
);

export default ShiftScheduling;