import mongoose from "mongoose";

const shiftSchema = new mongoose.Schema({
  name: String,
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
  },
});

const Shift = mongoose.model("Shift", shiftSchema);

export default Shift;
