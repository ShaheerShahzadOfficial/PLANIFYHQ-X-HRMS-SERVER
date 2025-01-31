import mongoose from "mongoose";

const deliverySchema = new mongoose.Schema({
  name: { type: String, required: true },
  status: { type: Boolean, default: true },
  company: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Delivery = mongoose.model("Delivery", deliverySchema);

export default Delivery;
