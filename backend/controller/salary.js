import Salary from "../models/salary.js";
import User from "../models/user.js";

export const GET_SALARIES = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    const query =
      user.role === "employee"
        ? { employee: user._id }
        : { company: user._id };
    const salaries = await Salary.find(query).populate("employee company");
    if (!salaries.length) {
      return res.status(404).json({ message: "No salaries found" });
    }
    res.status(200).json({
      message: "Salaries fetched successfully",
      salaries,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const CREATE_SALARY = async (req, res) => {
  try {
    const { employee, netSalary, earnings, deductions, company } = req.body;
    if (!employee || !netSalary || !earnings || !deductions || !company) {
      return res
        .status(400)
        .json({ message: "All fields are required" });
    }

    const salary = new Salary({
      employee,
      netSalary,
      earnings,
      deductions,
      company,
    });
    await salary.save();
    res.status(201).json(salary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const UPDATE_SALARY = async (req, res) => {
  try {
    const { id } = req.params;
    const { ...data } = req.body;

    const existingSalary = await Salary.findById(id);
    if (!existingSalary) {
      return res.status(404).json({ message: "Salary not found" });
    }

    if (existingSalary.company.toString() !== req.user.userId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this salary" });
    }

    const salary = await Salary.findByIdAndUpdate(id, data, {
      new: true,
    });
    res.status(200).json(salary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const DELETE_SALARY = async (req, res) => {
  try {
    const { id } = req.params;

    const salary = await Salary.findById(id);
    if (!salary) {
      return res.status(404).json({ message: "Salary not found" });
    }

    if (salary.company.toString() !== req.user.userId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this salary" });
    }

    await Salary.findByIdAndDelete(id);
    res.status(200).json({ message: "Salary deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
