import TimeSheet from "../models/timeSheet.js";
import User from "../models/user.js";

// Create timesheet entry
export const createTimesheet = async (req, res) => {
  try {
    const { date, hours, activity, oem, product, client } = req.body;

    // Validate required fields
    if (!date || !hours) {
      return res.status(400).json({
        success: false,
        message: "date and hours are required fields",
      });
    }

    // Validate hours is a positive number
    if (hours <= 0) {
      return res.status(400).json({
        success: false,
        message: "Hours must be greater than 0",
      });
    }

    // Validate that all required fields are provided
    const typeFields = { activity, oem, product, client };
    const missingFields = Object.entries(typeFields).filter(
      ([_, value]) => !value
    );

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields
          .map(([key]) => key)
          .join(", ")}`,
      });
    }

    const user = await User.findById(req.user.userId);

    // Create new timesheet entry
    const timesheet = new TimeSheet({
      employee: user._id,
      company: user.companyId,
      date,
      hours,
      activity,
      oem,
      product,
      client,
    });

    await timesheet.save();

    res.status(201).json({
      success: true,
      data: timesheet,
      message: "Timesheet entry created successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create timesheet entry",
      error: error.message,
    });
  }
};

// Get timesheet entries
export const getTimesheets = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    const timesheets = await TimeSheet.find({
      company: user.role === "admin" ? user._id : user.companyId,
    })
      .populate("employee", "name email profile")
      .populate("company", "name")
      .populate("activity", "name")
      .populate("oem", "name")
      .populate("product", "name")
      .populate("client", "name")
      .sort({ date: -1 }); // Sort by date descending

    res.status(200).json({
      success: true,
      count: timesheets.length,
      timesheets,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch timesheet entries",
      error: error.message,
    });
  }
};

// Update timesheet entry
export const updateTimesheet = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Validate timesheet exists
    const existingTimesheet = await TimeSheet.findById(id);
    if (!existingTimesheet) {
      return res.status(404).json({
        success: false,
        message: "Timesheet entry not found",
      });
    }

    // Validate hours if provided
    if (updates.hours && updates.hours <= 0) {
      return res.status(400).json({
        success: false,
        message: "Hours must be greater than 0",
      });
    }

    // Handle type field updates
    const typeFields = ["activity", "oem", "product", "client"];
    const updateTypes = typeFields.filter(
      (field) => updates[field] !== undefined
    );

    if (updateTypes.length > 1) {
      return res.status(400).json({
        success: false,
        message: `Cannot update to multiple types. You provided: ${updateTypes.join(
          ", "
        )}`,
      });
    }

    // Clear other type fields if changing type
    if (updateTypes.length === 1) {
      typeFields.forEach((field) => {
        if (field !== updateTypes[0]) {
          updates[field] = null;
        }
      });
    }

    const timesheet = await TimeSheet.findByIdAndUpdate(
      id,
      { ...updates, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: timesheet,
      message: "Timesheet entry updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update timesheet entry",
      error: error.message,
    });
  }
};

// Delete timesheet entry
export const deleteTimesheet = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate timesheet exists
    const timesheet = await TimeSheet.findById(id);
    if (!timesheet) {
      return res.status(404).json({
        success: false,
        message: "Timesheet entry not found",
      });
    }

    await TimeSheet.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Timesheet entry deleted successfully",
      data: timesheet,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete timesheet entry",
      error: error.message,
    });
  }
};

// Update timesheet status
export const updateTimesheetStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    // Check if status is valid
    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid status. Status must be pending, approved, or rejected",
      });
    }

    // Validate timesheet exists
    const timesheet = await TimeSheet.findById(id);
    if (!timesheet) {
      return res.status(404).json({
        success: false,
        message: "Timesheet entry not found",
      });
    }

    // Update status
    const updatedTimesheet = await TimeSheet.findByIdAndUpdate(
      id,
      { status, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: updatedTimesheet,
      message: "Timesheet status updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update timesheet status",
      error: error.message,
    });
  }
};
