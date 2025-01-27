import mongoose from "mongoose";

const clientSchema = new mongoose.Schema({
  name: String,
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ["active", "inactive"], default: "active" },
});

const Client = mongoose.model("Client", clientSchema);

export default Client;
