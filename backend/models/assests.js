import mongoose from "mongoose";

const assestsSchema = new mongoose.Schema({
  assetName: { type: String, required: true },
  assetType: { type: String, required: true },
  company: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
  brand: { type: String, required: true },
  purchaseDate: { type: Date, required: true },
  purchasePrice: { type: Number, required: true },
  serialNumber: { type: String, required: true },
  warrantyPeriod: { type: Number, required: true },
  warrantyExpiryDate: { type: Date, required: true },
});

const Assests = mongoose.model("Assests", assestsSchema);

export default Assests;
