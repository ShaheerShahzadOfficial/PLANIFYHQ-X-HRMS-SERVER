import Department from "../models/department.js";

export const CREATE_DEPARTMENT = async (req, res) => {
  const { name, shift } = req.body;
  const department = await Department.create({
    name,
    companyId: req.user.userId,
    shift,
  });
  res
    .status(200)
    .json({ message: "Department created successfully", department });
};

export const GET_DEPARTMENTS = async (req, res) => {
  const departments = await Department.find({ companyId: req.user.userId }).populate("shift");
  res
    .status(200)
    .json({ message: "Departments fetched successfully", departments });
};

export const UPDATE_DEPARTMENT = async (req, res) => {
  const { id } = req.params;
  const { name, shift } = req.body;
  const department = await Department.findByIdAndUpdate(
    id,
    { name, shift },
    { new: true }
  );
  res
    .status(200)
    .json({ message: "Department updated successfully", department });
};

export const DELETE_DEPARTMENT = async (req, res) => {
  const { id } = req.params;
  const department = await Department.findByIdAndDelete(id);
  res
    .status(200)
    .json({ message: "Department deleted successfully", department });
};

export const DEACTIVATE_DEPARTMENT = async (req, res) => {
  const { id } = req.params;
  const department = await Department.findByIdAndUpdate(id, {
    status: "inactive",
  });
  res
    .status(200)
    .json({ message: "Department deactivated successfully", department });
};
