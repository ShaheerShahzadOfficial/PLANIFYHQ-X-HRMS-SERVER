import mongoose from "mongoose";

const assestAssignmentSchema = new mongoose.Schema({
  assestId: { type: mongoose.Schema.Types.ObjectId, ref: "Assests" },
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
  issues: { type: String, required: true },
  assignedDate: { type: Date, required: true },
  returnDate: { type: Date, required: true },
});

const AssestAssignment = mongoose.model(
  "AssestAssignment",
  assestAssignmentSchema
);

export default AssestAssignment;
