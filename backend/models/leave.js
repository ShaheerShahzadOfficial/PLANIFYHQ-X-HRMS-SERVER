import mongoose from "mongoose";

const leaveSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  leaveType: {
    type: String,
    enum: ["sick", "vacation", "other"],
  },
  leaveReason: String,
  startDate: Date,
  endDate: Date,
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
});

const Leave = mongoose.model("Leave", leaveSchema);

export default Leave;
