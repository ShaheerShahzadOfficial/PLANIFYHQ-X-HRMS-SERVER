import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  phoneNumber: { type: Number },
  role: {
    type: String,
    enum: ["superadmin", "company", "employee"],
    default: "employee",
  },

  website: { type: String, required: false },
  profile: {
    url: String,
    public_id: String,
  },
  address: {
    type: String,
  },
  planId: { type: mongoose.Schema.Types.ObjectId, ref: "Plans" },
  status: { type: String, default: "active" },
  language: { type: String, default: "en" },
  isDeleted: { type: Boolean, default: false },
  currency: {
    type: String,
    enum: ["USD", "EUR", "GBP", "INR", "PKR"],
    default: "PKR",
  },
  designation: {
    type: String,
    required: false,
  },
  joinedAt: { type: Date, default: Date.now },
  employeeId: { type: String, required: false },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Departments",
    required: false,
  },
  designation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Designations",
    required: false,
  },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
  about: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
const User = mongoose.model("Users", userSchema);

export default User;
