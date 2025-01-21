import EmergencyContact from "../models/emergency-contact.js";

export const ADD_EMERGENCY_DETAILS = async (req, res) => {
  try {
    const {
      employeeId,
      emergencyContactName,
      emergencyContactNumber,
      relationship,
      email,
      type,
    } = req.body;

    // Validate required fields
    if (
      !employeeId ||
      !emergencyContactName ||
      !emergencyContactNumber ||
      !relationship ||
      !email ||
      !type
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Validate phone number (basic validation)
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    if (!phoneRegex.test(emergencyContactNumber)) {
      return res.status(400).json({ message: "Invalid phone number format" });
    }

    const newEmergencyDetails = new EmergencyContact({
      employeeId,
      name: emergencyContactName,
      phoneNumber: emergencyContactNumber,
      relationship,
      email,
      type,
    });

    await newEmergencyDetails.save();

    res.status(201).json({
      message: "Emergency details added successfully",
      emergencyDetails: newEmergencyDetails,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error adding emergency details",
      error: error.message,
    });
  }
};

export const UPDATE_EMERGENCY_DETAILS = async (req, res) => {
  try {
    const { employeeId, ...updateData } = req.body;

    if (!employeeId) {
      return res.status(400).json({ message: "Employee ID is required" });
    }

    // Check if emergency contact exists
    const existingContact = await EmergencyContact.findOne({ employeeId });
    if (!existingContact) {
      return res
        .status(404)
        .json({ message: "Emergency contact not found for this employee" });
    }

    // Validate email if provided
    if (updateData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(updateData.email)) {
        return res.status(400).json({ message: "Invalid email format" });
      }
    }

    // Validate phone number if provided
    if (updateData.phoneNumber) {
      const phoneRegex = /^\+?[\d\s-]{10,}$/;
      if (!phoneRegex.test(updateData.phoneNumber)) {
        return res.status(400).json({ message: "Invalid phone number format" });
      }
    }

    const updatedEmergencyDetails = await EmergencyContact.findOneAndUpdate(
      { employeeId },
      updateData,
      { new: true }
    );

    res.status(200).json({
      message: "Emergency details updated successfully",
      emergencyDetails: updatedEmergencyDetails,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating emergency details",
      error: error.message,
    });
  }
};
