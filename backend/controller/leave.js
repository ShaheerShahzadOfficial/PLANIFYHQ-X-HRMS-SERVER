import Leave from "../models/leave.js";
import User from "../models/user.js";
import { LeaveType } from "../models/leave.js";

export const GET_LEAVE_TYPES = async (req, res) => {
  try {
    const requestingUser = await User.findById(req.user.userId);
    if (!requestingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const leaveTypes = await LeaveType.find(
      requestingUser.role === "admin"
        ? { companyId: requestingUser._id }
        : { companyId: requestingUser.companyId }
    );

    res.status(200).json({
      message: "Leave types fetched successfully",
      leaveTypes,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const CREATE_LEAVE_TYPE = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Only admin can create leave types" });
    }

    const { name, days } = req.body;

    // Check if leave type with same name already exists for this company
    const existingLeaveType = await LeaveType.findOne({
      name,
      companyId: req.user.userId,
    });

    if (existingLeaveType) {
      return res
        .status(400)
        .json({ message: "Leave type with this name already exists" });
    }

    const leaveType = new LeaveType({
      name,
      days,
      companyId: req.user.userId,
    });
    await leaveType.save();
    res
      .status(201)
      .json({ message: "Leave type created successfully", leaveType });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const UPDATE_LEAVE_TYPE = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, days } = req.body;

    // Check if leave type with same name already exists for this company
    const existingLeaveType = await LeaveType.findOne({
      name,
      companyId: req.user.userId,
      _id: { $ne: id }, // Exclude current leave type from check
    });

    if (existingLeaveType) {
      return res
        .status(400)
        .json({ message: "Leave type with this name already exists" });
    }

    const leaveType = await LeaveType.findByIdAndUpdate(
      id,
      { name, days },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!leaveType) {
      return res.status(404).json({ message: "Leave type not found" });
    }

    res
      .status(200)
      .json({ message: "Leave type updated successfully", leaveType });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const DELETE_LEAVE_TYPE = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Leave type ID is required" });
    }

    // Check if leave type exists
    const leaveType = await LeaveType.findById(id);
    if (!leaveType) {
      return res.status(404).json({ message: "Leave type not found" });
    }

    // Check if user has permission (must be company admin)
    if (leaveType.companyId.toString() !== req.user.userId) {
      return res.status(403).json({
        message: "You are not authorized to delete this leave type",
      });
    }

    // Check if there are any leaves using this leave type
    const existingLeaves = await Leave.findOne({ leaveType: id });
    if (existingLeaves) {
      return res.status(400).json({
        message:
          "Cannot delete leave type that is being used by existing leaves",
      });
    }

    const deletedLeaveType = await LeaveType.findByIdAndDelete(id);
    if (!deletedLeaveType) {
      return res.status(500).json({ message: "Error deleting leave type" });
    }

    res.status(200).json({ message: "Leave type deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const GET_LEAVES = async (req, res) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    // First fetch all employees for this company
    const employees = await User.find({ companyId: req.user.userId });

    // Get employee IDs
    const employeeIds = employees.map((emp) => emp._id);

    // Then fetch leaves for all these employees
    const leaves = await Leave.find({
      employee: { $in: employeeIds },
      company: req.user.userId,
    })
      .populate("employee", "-password")
      .populate("leaveType");

    res.status(200).json({
      message: "Leaves fetched successfully",
      leaves,
      totalEmployees: employees.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const GET_MY_LEAVES = async (req, res) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    const leaves = await Leave.find({ employee: req.user.userId })
      .populate("leaveType  employee")
      .populate("company", "-password");

    res.status(200).json({ message: "Leaves fetched successfully", leaves });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const CREATE_LEAVE = async (req, res) => {
  try {
    const { leaveType, startDate, endDate, reason, leaveTime } = req.body;

    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    // Validate required fields
    if (!leaveType || !startDate || !endDate || !leaveTime) {
      return res.status(400).json({
        message:
          "Leave type, start date, end date and leave time are required fields",
      });
    }

    // Validate date formats
    if (!Date.parse(startDate) || !Date.parse(endDate)) {
      return res.status(400).json({
        message: "Invalid date format",
      });
    }

    // Validate dates
    if (new Date(startDate) > new Date(endDate)) {
      return res.status(400).json({
        message: "Start date cannot be after end date",
      });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check for overlapping leaves
    const overlappingLeave = await Leave.findOne({
      employee: user._id,
      company: user.companyId,
      $or: [
        {
          startDate: { $lte: startDate },
          endDate: { $gte: startDate },
        },
        {
          startDate: { $lte: endDate },
          endDate: { $gte: endDate },
        },
      ],
    });

    if (overlappingLeave) {
      return res.status(400).json({
        message: "You already have leave scheduled for these dates",
      });
    }

    // Check total leaves taken of this type
    const takenLeaves = await Leave.find({
      employee: user._id,
      leaveType: leaveType,
      status: "approved",
    }).populate("leaveType");

    let totalDaysTaken = 0;
    takenLeaves.forEach((leave) => {
      const start = new Date(leave.startDate);
      const end = new Date(leave.endDate);
      const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
      totalDaysTaken += days;
    });

    // Calculate days requested in current leave
    const requestedDays = (() => {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const totalDays =
        Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24)) + 1;

      // Adjust for leaveTime (Half or Full Day)
      if (leaveTime === "First Half" || leaveTime === "Second Half") {
        return Math.round(totalDays / 4); // Half days rounded to nearest whole number
      }

      return totalDays; // Default for Full Day
    })();

    // Get leave type details
    const leaveTypeDetails = await LeaveType.findById(leaveType);
    if (!leaveTypeDetails) {
      return res.status(404).json({ message: "Leave type not found" });
    }

    if (totalDaysTaken + requestedDays > leaveTypeDetails.days) {
      return res.status(400).json({
        message: `You have exceeded the maximum allowed leaves (${leaveTypeDetails.days} days) for this leave type. You have already taken ${totalDaysTaken} days.`,
      });
    }

    const leave = new Leave({
      employee: req.user.userId,
      company: user.companyId,
      leaveType,
      startDate,
      endDate,
      reason,
      status: "pending",
      leaveTime,
    });

    await leave.save();

    const populatedLeave = await Leave.findById(leave._id)
      .populate("employee", "-password")
      .populate("leaveType");

    if (!populatedLeave) {
      return res.status(500).json({ message: "Error creating leave" });
    }

    res.status(201).json(populatedLeave);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const UPDATE_LEAVE = async (req, res) => {
  try {
    const { id } = req.params;
    const { ...data } = req.body;

    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    if (!id) {
      return res.status(400).json({ message: "Leave ID is required" });
    }

    // Validate if leave exists
    const existingLeave = await Leave.findById(id);
    if (!existingLeave) {
      return res.status(404).json({ message: "Leave not found" });
    }

    // Validate if user has permission
    if (existingLeave.company.toString() !== req.user.userId) {
      return res.status(403).json({
        message: "You are not authorized to update this leave",
      });
    }

    // If dates are being updated, check for conflicts
    if (data.startDate || data.endDate) {
      const startDate = data.startDate || existingLeave.startDate;
      const endDate = data.endDate || existingLeave.endDate;

      // Validate date formats
      if (!Date.parse(startDate) || !Date.parse(endDate)) {
        return res.status(400).json({
          message: "Invalid date format",
        });
      }

      if (new Date(startDate) > new Date(endDate)) {
        return res.status(400).json({
          message: "Start date cannot be after end date",
        });
      }

      const overlappingLeave = await Leave.findOne({
        employee: existingLeave.employee,
        company: existingLeave.company,
        _id: { $ne: id },
        $or: [
          {
            startDate: { $lte: startDate },
            endDate: { $gte: startDate },
          },
          {
            startDate: { $lte: endDate },
            endDate: { $gte: endDate },
          },
        ],
      });

      if (overlappingLeave) {
        return res.status(400).json({
          message: "Employee already has leave scheduled for these dates",
        });
      }
    }

    const leave = await Leave.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    })
      .populate("employee", "-password")
      .populate("leaveType");

    if (!leave) {
      return res.status(500).json({ message: "Error updating leave" });
    }

    res.status(200).json({ message: "Leave updated successfully", leave });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const DELETE_LEAVE = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    if (!id) {
      return res.status(400).json({ message: "Leave ID is required" });
    }

    // Validate if leave exists
    const leave = await Leave.findById(id);
    if (!leave) {
      return res.status(404).json({ message: "Leave not found" });
    }

    // Check if leave is already approved

    // Validate if user has permission (either company admin or leave creator)
    if (
      leave.company.toString() !== req.user.userId &&
      leave.employee.toString() !== req.user.userId
    ) {
      return res.status(403).json({
        message: "You are not authorized to delete this leave",
      });
    }

    if (req.user.role !== "admin" && leave.status === "approved") {
      return res.status(400).json({
        message: "Only admin can delete an approved leave request",
      });
    }

    const deletedLeave = await Leave.findByIdAndDelete(id);
    if (!deletedLeave) {
      return res.status(500).json({ message: "Error deleting leave" });
    }

    res.status(200).json({ message: "Leave deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const UPDATE_LEAVE_STATUS = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    // Validate status
    if (!status || !["approved", "rejected", "pending"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const leave = await Leave.findById(id);
    if (!leave) {
      return res.status(404).json({ message: "Leave not found" });
    }

    // Check if user has permission (must be company admin)
    if (leave.company.toString() !== req.user.userId) {
      return res.status(403).json({
        message: "You are not authorized to approve/reject this leave",
      });
    }

    leave.status = status;
    await leave.save();

    res.status(200).json({
      message: `Leave ${status} successfully`,
      leave,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
