import mongoose from "mongoose";

const designationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
  departmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Departments" },
  status: { type: String, default: "active" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Designation = mongoose.model("Designations", designationSchema);

export default Designation;
