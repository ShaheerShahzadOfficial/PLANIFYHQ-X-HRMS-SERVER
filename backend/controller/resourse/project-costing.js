import ProjectCosting from "../../models/resourse/projectCosting.js";
import mongoose from "mongoose";

// Validation helpers
const validateProjectCostingInput = (data) => {
  const errors = {};
  let isValid = true;

  if (!data.project || !mongoose.Types.ObjectId.isValid(data.project)) {
    errors.project = "Valid project ID is required";
    isValid = false;
  }

  if (!data.title?.trim()) {
    errors.title = "Title is required";
    isValid = false;
  }

  if (!data.resources || data.resources.length === 0) {
    errors.resources = "At least one resource is required";
    isValid = false;
  } else {
    data.resources.forEach((resource, index) => {
      if (
        !resource.resource ||
        !mongoose.Types.ObjectId.isValid(resource.resource)
      ) {
        errors[`resources[${index}].resource`] =
          "Valid resource ID is required";
        isValid = false;
      }
      if (
        typeof resource.numberOfDays !== "number" ||
        resource.numberOfDays <= 0
      ) {
        errors[`resources[${index}].numberOfDays`] =
          "Positive number of days required";
        isValid = false;
      }
      if (typeof resource.cost !== "number" || resource.cost <= 0) {
        errors[`resources[${index}].cost`] = "Positive cost value required";
        isValid = false;
      }
    });
  }

  return { isValid, errors };
};

const validatePositiveNumber = (value, fieldName) => {
  if (typeof value !== "number" || value < 0) {
    return `${fieldName} must be a positive number`;
  }
  return null;
};

// Controllers
export const createProjectCosting = async (req, res) => {
  try {
    const { isValid, errors } = validateProjectCostingInput(req.body);
    if (!isValid) {
      return res.status(400).json({ errors });
    }


    const newCosting = new ProjectCosting({
      ...req.body,
      company: req.user.userId,
    });
    const savedCosting = await newCosting.save();

    // Populate references after save
    const populatedCosting = await ProjectCosting.findById(savedCosting._id)
      .populate("project")
      .populate("resources.resource")
      .populate("company");

    res.status(201).json(populatedCosting);
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).reduce((acc, err) => {
        acc[err.path] = err.message;
        return acc;
      }, {});
      return res.status(400).json({ errors });
    }
    res.status(500).json({
      message: "Server error while creating project costing",
      error: error.message,
    });
  }
};

export const getProjectCostingById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const costing = await ProjectCosting.findById(req.params.id)
      .populate("project")
      .populate("resources.resource")
      .populate("company");

    if (!costing) {
      return res.status(404).json({ message: "Project costing not found" });
    }

    res.json(costing);
  } catch (error) {
    res.status(500).json({
      message: "Server error while fetching project costing",
      error: error.message,
    });
  }
};

export const updateProjectCosting = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const { isValid, errors } = validateProjectCostingInput(req.body);
    if (!isValid) {
      return res.status(400).json({ errors });
    }

    const costing = await ProjectCosting.findById(req.params.id);
    if (!costing) {
      return res.status(404).json({ message: "Project costing not found" });
    }

    // Prevent version conflict
    if (req.body.__v !== costing.__v) {
      return res.status(409).json({
        message: "Version conflict - please refresh and try again",
      });
    }

    // Update fields while preserving calculated fields
    const updatableFields = [
      "title",
      "description",
      "resources",
      "expenses",
      "costDetails",
    ];

    updatableFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        costing[field] = req.body[field];
      }
    });

    costing.__v++; // Increment version number
    const updatedCosting = await costing.save();

    const populatedCosting = await ProjectCosting.findById(updatedCosting._id)
      .populate("project")
      .populate("resources.resource")
      .populate("company");

    res.json(populatedCosting);
  } catch (error) {
    if (error.name === "VersionError") {
      return res.status(409).json({ message: "Version conflict detected" });
    }
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).reduce((acc, err) => {
        acc[err.path] = err.message;
        return acc;
      }, {});
      return res.status(400).json({ errors });
    }
    res.status(500).json({
      message: "Server error while updating project costing",
      error: error.message,
    });
  }
};

export const deleteProjectCosting = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const costing = await ProjectCosting.findByIdAndDelete(req.params.id);
    if (!costing) {
      return res.status(404).json({ message: "Project costing not found" });
    }

    res.json({
      message: "Project costing deleted successfully",
      deletedId: costing._id,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error while deleting project costing",
      error: error.message,
    });
  }
};

export const listProjectCostings = async (req, res) => {
  try {
    const companyId = req.user?.userId;
    const filter = {};

    if (companyId) {
      if (!mongoose.Types.ObjectId.isValid(companyId)) {
        return res.status(400).json({ message: "Invalid company ID format" });
      }
      filter.company = companyId;
    }

    const [costings, total] = await Promise.all([
      ProjectCosting.find(filter)
        .populate("project")
        .populate("company")
        .populate({
          path: "resources.resource",
          populate: [
            { path: "designation" },
            { path: "department" },
          ],
        })
        .sort({ createdAt: -1 }),
      ProjectCosting.countDocuments(filter),
    ]);

    res.json({
      total,
      results: costings,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error while fetching project costings",
      error: error.message,
    });
  }
};

// Error handling middleware (to be used in your routes)
export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err.name === "CastError") {
    return res.status(400).json({
      message: "Invalid ID format",
      field: err.path,
    });
  }

  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).reduce((acc, error) => {
      acc[error.path] = error.message;
      return acc;
    }, {});
    return res.status(400).json({ errors });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(409).json({
      message: `Duplicate field value: ${field}`,
      field,
    });
  }

  res.status(500).json({
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
};
