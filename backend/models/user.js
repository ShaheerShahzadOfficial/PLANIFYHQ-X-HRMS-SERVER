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
  designation: { 
    type: String,
     required: false,
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
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
const User = mongoose.model("Users", userSchema);

export default User;
