import mongoose from "mongoose";

const experienceSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  designation: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
});
const Experience = mongoose.model("Experience", experienceSchema);

export default Experience;
