import Project from "../models/project.js";
import User from "../models/user.js";

export const CREATE_PROJECT = async (req, res) => {
  try {
    const {
      name,
      client,
      projectLogo,
      startDate,
      endDate,
      priority,
      status,
      projectId,
    } = req.body;

    if (!name || !client) {
      return res.status(400).json({ message: "Name and client are required" });
    }

    const project = await Project.create({
      projectId,
      name,
      client: client.name,
      projectLogo,
      startDate,
      endDate,
      priority,
      status,
      company: req.user.userId,
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const GET_ALL_PROJECTS = async (req, res) => {
  try {
    const projects = await Project.find({ company: req.user.userId })
      .populate("client")
      .sort({ createdAt: -1 });
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const UPDATE_PROJECT = async (req, res) => {
  try {
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, company: req.user.userId },
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const DELETE_PROJECT = async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({
      _id: req.params.id,
      company: req.user.userId,
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const GET_PROJECT = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ message: "Project ID is required" });
    }
    const user = await User.findById(req.user.userId);
    const project = await Project.findOne({
      _id: req.params.id,
      company: user.companyId || user._id,
    }).populate("client");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
