import BankInfo from "../models/bank-info.js";

export const ADD_BANK_DETAILS = async (req, res) => {
  try {
    const { employeeId, bankDetails } = req.body;

    if (!employeeId || !bankDetails) {
      return res.status(400).json({
        success: false,
        message: "Employee ID and bank details are required",
      });
    }

    // Validate bank details fields
    if (
      !bankDetails.bankName ||
      !bankDetails.branchAddress ||
      !bankDetails.accountNumber ||
      !bankDetails.IFSC_Code
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Bank name, branch address, account number and IFSC code are required",
      });
    }

    const bankDetailsToAdd = {
      ...bankDetails,
      employeeId,
    };

    const savedDetails = await BankInfo.create(bankDetailsToAdd);

    res.status(201).json({
      success: true,
      message: "Bank details added successfully",
      data: savedDetails,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error adding bank details",
      error: error.message,
    });
  }
};

export const UPDATE_BANK_DETAILS = async (req, res) => {
  try {
    const { employeeId, bankDetails } = req.body;

    if (!employeeId || !bankDetails) {
      return res.status(400).json({
        success: false,
        message: "Employee ID and bank details are required",
      });
    }

    if (!bankDetails._id) {
      return res.status(400).json({
        success: false,
        message: "Bank detail ID is required for updating",
      });
    }

    if (
      !bankDetails.bankName ||
      !bankDetails.branchAddress ||
      !bankDetails.accountNumber ||
      !bankDetails.IFSC_Code
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Bank name, branch address, account number and IFSC code are required",
      });
    }

    const updatedDetails = await BankInfo.findByIdAndUpdate(
      bankDetails._id,
      { ...bankDetails, employeeId },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Bank details updated successfully",
      data: updatedDetails,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating bank details",
      error: error.message,
    });
  }
};
