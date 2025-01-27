import mongoose from "mongoose";

const shiftSchedulingSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
  
  departmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Departments",
  },

  startTime: Date,

  endTime: Date,

  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  shiftId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Shift",
  },
});

const ShiftScheduling = mongoose.model(
  "ShiftScheduling",
  shiftSchedulingSchema
);

export default ShiftScheduling;
