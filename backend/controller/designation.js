import Designation from "../models/designation.js";

export const CREATE_DESIGNATION = async (req, res) => {
  const { name } = req.body;
  const designation = await Designation.create({ name, companyId: req.user.userId });
  res.status(200).json({ message: "Designation created successfully", designation });
};

export const GET_DESIGNATIONS = async (req, res) => {
  const designations = await Designation.find({ companyId: req.user.userId });
  res.status(200).json({ message: "Designations fetched successfully", designations });
};


export const UPDATE_DESIGNATION = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const designation = await Designation.findByIdAndUpdate(id, { name }, { new: true });
  res.status(200).json({ message: "Designation updated successfully", designation });
};

export const DELETE_DESIGNATION = async (req, res) => {
  const { id } = req.params;
  const designation = await Designation.findByIdAndDelete(id);
  res.status(200).json({ message: "Designation deleted successfully", designation });
};

export const DEACTIVATE_DESIGNATION = async (req, res) => {
  const { id } = req.params;
  const designation = await Designation.findByIdAndUpdate(id, { status: "inactive" });
  res.status(200).json({ message: "Designation deactivated successfully", designation });
};
