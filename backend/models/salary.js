import mongoose from "mongoose";

const salarySchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  netSalary: {
    type: Number,
    required: true,
  },
  earnings: {
    basic: {
      type: Number,
      required: true,
    },
    da: {
      type: Number,
      required: true,
    },
    hra: {
      type: Number,
      required: true,
    },
    conveyance: {
      type: Number,
      required: true,
    },
    allowance: {
      type: Number,
      required: true,
    },
    medicalAllowance: {
      type: Number,
      required: true,
    },
    others: {
      type: Number,
      required: true,
    },
  },
  deductions: {
    tds: {
      type: Number,
      required: true,
    },
    esi: {
      type: Number,
      required: true,
    },
    pf: {
      type: Number,
      required: true,
    },
    leave: {
      type: Number,
      required: true,
    },
    profTax: {
      type: Number,
      required: true,
    },
    labourWelfare: {
      type: Number,
      required: true,
    },
    others: {
      type: Number,
      required: true,
    },
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,

  },
});

const Salary = mongoose.model("Salary", salarySchema);

export default Salary;

