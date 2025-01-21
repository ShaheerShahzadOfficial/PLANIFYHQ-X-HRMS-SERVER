import Leave from "../models/leave";
import User from "../models/user";

export const GET_LEAVES = async (req, res) => {
  try {
    const leaves = await Leave.find({ company: req.user.userId })
      .populate("employee", "-password")
      .populate("leaveType");

    if (!leaves.length) {
      return res.status(404).json({ message: "No leaves found" });
    }
    res.status(200).json({ message: "Leaves fetched successfully", leaves });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const CREATE_LEAVE = async (req, res) => {
  try {
    const { leaveType, startDate, endDate, reason } = req.body;

    // Validate required fields
    if (!leaveType || !startDate || !endDate) {
      return res.status(400).json({
        message: "Leave type, start date and end date are required fields",
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

    const leave = new Leave({
      employee: req.user.userId,
      company: req.user.companyId,
      leaveType,
      startDate,
      endDate,
      reason,
      status: "pending",
    });

    await leave.save();

    const populatedLeave = await Leave.findById(leave._id)
      .populate("employee", "-password")
      .populate("leaveType");

    res.status(201).json(populatedLeave);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const UPDATE_LEAVE = async (req, res) => {
  try {
    const { id } = req.params;
    const { ...data } = req.body;

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

    res.status(200).json({ message: "Leave updated successfully", leave });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const DELETE_LEAVE = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate if leave exists
    const leave = await Leave.findById(id);
    if (!leave) {
      return res.status(404).json({ message: "Leave not found" });
    }

    // Validate if user has permission
    if (leave.company.toString() !== req.user.userId) {
      return res.status(403).json({
        message: "You are not authorized to delete this leave",
      });
    }

    await Leave.findByIdAndDelete(id);
    res.status(200).json({ message: "Leave deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
