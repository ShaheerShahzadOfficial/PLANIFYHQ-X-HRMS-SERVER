import mongoose from "mongoose";

const educationDetailsSchema = new mongoose.Schema({
  degree: { type: String, required: true },
  institution: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
});

const EducationDetails = mongoose.model(
  "EducationDetails",
  educationDetailsSchema
);

export default EducationDetails;
