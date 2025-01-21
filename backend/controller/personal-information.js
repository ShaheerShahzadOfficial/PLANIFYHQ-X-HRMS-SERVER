import PersonalInfo from "../models/personal-info.js";

export const ADD_PERSONAL_INFO = async (req, res) => {
  try {
    const { employeeId, ...data } = req.body;

    if (!employeeId) {
      return res.status(400).json({ message: "Employee ID is required" });
    }

    // Check if personal info already exists for this employee
    const existingInfo = await PersonalInfo.findOne({ employeeId });
    if (existingInfo) {
      return res
        .status(400)
        .json({ message: "Personal info already exists for this employee" });
    }

    // Validate required fields based on schema
    const requiredFields = [
      "gender",
      "dateOfBirth",
      "maritalStatus",
      "nationality",
      "religion",
      "passportNumber",
      "passportExpiryDate",
      "noofchildren",
    ];

    const missingFields = requiredFields.filter((field) => !data[field]);
    if (missingFields.length > 0) {
      return res.status(400).json({
        message: "Missing required fields",
        fields: missingFields,
      });
    }

    if (isNaN(data.noofchildren) || data.noofchildren < 0) {
      return res
        .status(400)
        .json({ message: "Number of children must be a non-negative number" });
    }

    // Validate dates
    const currentDate = new Date();
    const birthDate = new Date(data.dateOfBirth);
    const passportExpiry = new Date(data.passportExpiryDate);

    if (birthDate >= currentDate) {
      return res
        .status(400)
        .json({ message: "Date of birth must be in the past" });
    }

    if (passportExpiry <= currentDate) {
      return res
        .status(400)
        .json({ message: "Passport expiry date must be in the future" });
    }

    const personalInfo = await PersonalInfo.create({ employeeId, ...data });
    res
      .status(200)
      .json({ message: "Personal info added successfully", personalInfo });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding personal info", error: error.message });
  }
};

export const UPDATE_PERSONAL_INFO = async (req, res) => {
  try {
    const { employeeId, ...data } = req.body;

    if (!employeeId) {
      return res.status(400).json({ message: "Employee ID is required" });
    }

    // Check if personal info exists

    if (
      data.noofchildren &&
      (isNaN(data.noofchildren) || data.noofchildren < 0)
    ) {
      return res
        .status(400)
        .json({ message: "Number of children must be a non-negative number" });
    }

    // Validate dates if provided
    const currentDate = new Date();

    if (data.dateOfBirth) {
      const birthDate = new Date(data.dateOfBirth);
      if (birthDate >= currentDate) {
        return res
          .status(400)
          .json({ message: "Date of birth must be in the past" });
      }
    }

    if (data.passportExpiryDate) {
      const passportExpiry = new Date(data.passportExpiryDate);
      if (passportExpiry <= currentDate) {
        return res
          .status(400)
          .json({ message: "Passport expiry date must be in the future" });
      }
    }

    if (data.passportNumber) {
      const passportNumber = data.passportNumber;
      if (passportNumber.length !== 8) {
        return res.status(400).json({ message: "Passport number must be 8 digits" });
      }
    }




    const existingInfo = await PersonalInfo.findOne({ employeeId });
    if (!existingInfo) {
      const personalInfo = await PersonalInfo.create({ employeeId, ...data });
      return res
        .status(200)
        .json({ message: "Personal info added successfully", personalInfo });
    }

    const personalInfo = await PersonalInfo.findOneAndUpdate(
      { employeeId },
      { ...data },
      { new: true }
    );

    res
      .status(200)
      .json({ message: "Personal info updated successfully", personalInfo });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating personal info", error: error.message });
  }
};
