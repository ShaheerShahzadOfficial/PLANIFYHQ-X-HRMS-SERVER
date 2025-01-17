import mongoose from "mongoose";

const attendenceSchema = new mongoose.Schema({
  date: Date,
  timeIn: Date,
  timeOut: Date,
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Attendence = mongoose.model("Attendence", attendenceSchema);

export default Attendence;

    