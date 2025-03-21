import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
  status: { type: String, enum: ["active", "inactive"], default: "active" },
  shift: { type: mongoose.Schema.Types.ObjectId, ref: "ShiftScheduling" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Department = mongoose.model("Departments", departmentSchema);

export default Department;
