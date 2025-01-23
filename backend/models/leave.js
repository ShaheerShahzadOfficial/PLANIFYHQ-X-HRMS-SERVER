import mongoose from "mongoose";

const leaveSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
  leaveTime: {
    type: String,
    enum: ["Full Day", "First Half", "Second Half"],
    default: "Full Day",
  },
  leaveType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "LeaveType",
  },
  leaveReason: String,
  startDate: Date,
  endDate: Date,
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
});

const Leave = mongoose.model("Leave", leaveSchema);

export default Leave;

const leaveTypeSchema = new mongoose.Schema({
  name: String,
  days: Number,
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
});

const LeaveType = mongoose.model("LeaveType", leaveTypeSchema);

export { LeaveType };
