import Sheet from "../../models/resourse/sheet.js";
import User from "../../models/user.js";

// Create a new sheet
export const createSheet = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ message: "Request body is required" });
    }
    const user = await User.findById(req.user.userId);
    // Add company ID from authenticated admin user
    const sheetData = {
      assetType: req.body.assetType,
      assessmentType: req.body.assessmentType,
      assessmentMode: req.body.assessmentMode,
      delivery: req.body.delivery,
      size: req.body.size,
      quantity: req.body.quantity,
      weeks: req.body.weeks,
      months: req.body.months,
      resourceWeeks: req.body.resourceWeeks,
      resource: req.body.resource,
      company: user._id,
    };

    const newSheet = new Sheet(sheetData);
    const savedSheet = await newSheet.save();

    res.status(201).json(savedSheet);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Validation failed",
        details: error.errors,
      });
    }
    res.status(500).json({
      message: "Failed to create sheet",
      error: error.message,
    });
  }
};

// Get all sheets
export const getAllSheets = async (req, res) => {
  try {
    const sheets = await Sheet.find()
      .populate("assetType")
      .populate("assessmentType")
      .populate("assessmentMode")
      .populate("delivery")
      .populate("resource")
      .populate("company");

    if (!sheets || sheets.length === 0) {
      return res.status(404).json({ message: "No sheets found" });
    }
    res.status(200).json(sheets);
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve sheets",
      error: error.message,
    });
  }
};

// Get sheet by ID
export const getSheetById = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ message: "Sheet ID is required" });
    }

    const sheet = await Sheet.findById(req.params.id)
      .populate("assetType")
      .populate("assessmentType")
      .populate("assessmentMode")
      .populate("delivery")
      .populate("resource")
      .populate("company");

    if (!sheet) {
      return res.status(404).json({ message: "Sheet not found" });
    }
    res.status(200).json(sheet);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid sheet ID format" });
    }
    res.status(500).json({
      message: "Failed to retrieve sheet",
      error: error.message,
    });
  }
};

// Update sheet
export const updateSheet = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ message: "Sheet ID is required" });
    }
    if (!req.body) {
      return res.status(400).json({ message: "Request body is required" });
    }

    const updatedSheet = await Sheet.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        updatedAt: Date.now(),
      },
      { new: true, runValidators: true }
    );

    if (!updatedSheet) {
      return res.status(404).json({ message: "Sheet not found" });
    }
    res.status(200).json(updatedSheet);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Validation failed",
        details: error.errors,
      });
    }
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid sheet ID format" });
    }
    res.status(500).json({
      message: "Failed to update sheet",
      error: error.message,
    });
  }
};

// Delete sheet
export const deleteSheet = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ message: "Sheet ID is required" });
    }

    const deletedSheet = await Sheet.findByIdAndDelete(req.params.id);

    if (!deletedSheet) {
      return res.status(404).json({ message: "Sheet not found" });
    }
    res.status(200).json({ message: "Sheet deleted successfully" });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid sheet ID format" });
    }
    res.status(500).json({
      message: "Failed to delete sheet",
      error: error.message,
    });
  }
};

// Get sheets by company
export const getSheetsByCompany = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    const sheets = await Sheet.find({ company: user._id })
      .populate("assetType")
      .populate("assessmentType")
      .populate("assessmentMode")
      .populate("delivery")
      .populate({
        path: "resource",
        populate: [
          { path: "department" },
          { path: "designation" }
        ]
      })
      .populate("company");

    res.status(200).json(sheets);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid company ID format" });
    }
    res.status(500).json({
      message: "Failed to retrieve sheets by company",
      error: error.message,
    });
  }
};
