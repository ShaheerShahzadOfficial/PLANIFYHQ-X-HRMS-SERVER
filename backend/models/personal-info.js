import mongoose from "mongoose";

const personalInfoSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
  gender: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  address: { type: String, required: true },
  maritalStatus: { type: String, required: true },
  nationality: { type: String, required: true },
  religion: { type: String, required: true },
  passportNumber: { type: String, required: true },
  passportExpiryDate: { type: Date, required: true },
  noofchildren: { type: Number, required: true },
  employmentSpouse: { type: String, required: true },
});

const PersonalInfo = mongoose.model("PersonalInfo", personalInfoSchema);

export default PersonalInfo;

