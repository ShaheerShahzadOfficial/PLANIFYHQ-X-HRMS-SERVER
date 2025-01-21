import Experience from "../models/experience.js";

export const ADD_EXPERIENCE_DETAILS = async (req, res) => {
  try {
    const { employeeId, experienceDetails } = req.body;

    if (!employeeId || !experienceDetails) {
      return res.status(400).json({
        success: false,
        message: "Employee ID and experience details are required",
      });
    }

    // Validate experience details fields
    if (
      !experienceDetails.companyName ||
      !experienceDetails.designation ||
      !experienceDetails.startDate ||
      !experienceDetails.endDate
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Company name, designation, start date and end date are required for experience details",
      });
    }

    // Validate dates
    const startDate = new Date(experienceDetails.startDate);
    const endDate = new Date(experienceDetails.endDate);

    if (endDate < startDate) {
      return res.status(400).json({
        success: false,
        message: "End date cannot be earlier than start date",
      });
    }

    const experienceDetailsToAdd = {
      ...experienceDetails,
      employeeId,
    };

    const savedDetails = await Experience.create(experienceDetailsToAdd);

    res.status(201).json({
      success: true,
      message: "Experience details added successfully",
      data: savedDetails,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error adding experience details",
      error: error.message,
    });
  }
};

export const UPDATE_EXPERIENCE_DETAILS = async (req, res) => {
  try {
    const { employeeId, experienceDetails } = req.body;

    if (!employeeId || !experienceDetails) {
      return res.status(400).json({
        success: false,
        message: "Employee ID and experience details are required",
      });
    }

    if (!experienceDetails._id) {
      return res.status(400).json({
        success: false,
        message: "Experience detail ID is required for updating",
      });
    }

    if (
      !experienceDetails.companyName ||
      !experienceDetails.designation ||
      !experienceDetails.startDate ||
      !experienceDetails.endDate
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Company name, designation, start date and end date are required for experience details",
      });
    }

    // Validate dates
    const startDate = new Date(experienceDetails.startDate);
    const endDate = new Date(experienceDetails.endDate);

    if (endDate < startDate) {
      return res.status(400).json({
        success: false,
        message: "End date cannot be earlier than start date",
      });
    }

    const updatedDetails = await Experience.findByIdAndUpdate(
      experienceDetails._id,
      { ...experienceDetails, employeeId },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Experience details updated successfully",
      data: updatedDetails,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating experience details",
      error: error.message,
    });
  }
};
