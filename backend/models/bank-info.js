import mongoose from "mongoose";

const bankInfoSchema = new mongoose.Schema({
  bankName: { type: String, required: true },
  branchAddress: { type: String, required: true },
  accountNumber: { type: String, required: true },
  IFSC_Code: { type: String, required: true },
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
});

const BankInfo = mongoose.model("BankInfo", bankInfoSchema);

export default BankInfo;