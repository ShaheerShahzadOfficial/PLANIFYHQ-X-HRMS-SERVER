import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  projectId: {
    type: String,
  },
  name: String,
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
  },
  projectLogo: {
    url: String,
    publicId: String,
  },
  startDate: Date,
  endDate: Date,
  priority: {
    type: String,
    enum: ["high", "medium", "low"],
    default: "medium",
  },
  status: { type: String, enum: ["active", "inactive"], default: "active" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Project = mongoose.model("Project", projectSchema);

export default Project;
