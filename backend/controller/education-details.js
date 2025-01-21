import EducationDetails from "../models/education-details.js";

export const ADD_EDUCATION_DETAILS = async (req, res) => {
  try {
    const { employeeId, educationDetails } = req.body;

    if (!employeeId || !educationDetails) {
      return res.status(400).json({
        success: false,
        message: "Employee ID and education details are required"
      });
    }

    // Validate education details fields
    for (const detail of educationDetails) {
      if (!detail.degree || !detail.institution || !detail.startDate || !detail.endDate) {
        return res.status(400).json({
          success: false,
          message: "Degree, institution, start date and end date are required for all education details"
        });
      }

      // Validate dates
      const startDate = new Date(detail.startDate);
      const endDate = new Date(detail.endDate);
      
      if (endDate < startDate) {
        return res.status(400).json({
          success: false,
          message: "End date cannot be earlier than start date"
        });
      }
    }

    const educationDetailsToAdd = educationDetails.map(detail => ({
      ...detail,
      employeeId
    }));

    const savedDetails = await EducationDetails.insertMany(educationDetailsToAdd);

    res.status(201).json({
      success: true,
      message: "Education details added successfully",
      data: savedDetails
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error adding education details",
      error: error.message
    });
  }
};

export const UPDATE_EDUCATION_DETAILS = async (req, res) => {
  try {
    const { employeeId, educationDetails } = req.body;

    if (!employeeId || !educationDetails) {
      return res.status(400).json({
        success: false,
        message: "Employee ID and education details are required"
      });
    }

    // Validate education details fields
    for (const detail of educationDetails) {
      if (!detail._id) {
        return res.status(400).json({
          success: false,
          message: "Education detail ID is required for updating"
        });
      }

      if (!detail.degree || !detail.institution || !detail.startDate || !detail.endDate) {
        return res.status(400).json({
          success: false,
          message: "Degree, institution, start date and end date are required for all education details"
        });
      }

      // Validate dates
      const startDate = new Date(detail.startDate);
      const endDate = new Date(detail.endDate);
      
      if (endDate < startDate) {
        return res.status(400).json({
          success: false,
          message: "End date cannot be earlier than start date"
        });
      }
    }

    const updatePromises = educationDetails.map(detail => 
      EducationDetails.findByIdAndUpdate(
        detail._id,
        { ...detail, employeeId },
        { new: true, runValidators: true }
      )
    );

    const updatedDetails = await Promise.all(updatePromises);

    res.status(200).json({
      success: true,
      message: "Education details updated successfully",
      data: updatedDetails
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating education details",
      error: error.message
    });
  }
};
