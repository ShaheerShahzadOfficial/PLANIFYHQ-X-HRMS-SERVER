import mongoose from "mongoose";

const resourseSalarySchema = new mongoose.Schema({
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Departments",
  },
  designation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Designations",
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
  monthlySalary: {
    type: Number,
    required: true,
  },
  noOfDays: {
    type: Number,
    required: true,
    default: 20,
  },
  dailySalary: {
    type: Number,
    required: true,
  },
  hourlySalary: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Resourse-Salary", resourseSalarySchema);
