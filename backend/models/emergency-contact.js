import mongoose from "mongoose";

const emergencyContactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  relationship: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  email: { type: String, required: true },
  type: { type: String, required: true },
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
});

const EmergencyContact = mongoose.model(
  "EmergencyContact",
  emergencyContactSchema
);

export default EmergencyContact;
