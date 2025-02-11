import Attendence from "../models/attendence.js";
import User from "../models/user.js";
export const CHECKIN = async (req, res) => {
  try {
    const employeeId = req.user.userId;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const user = await User.findById(employeeId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if already checked in today
    const existingAttendance = await Attendence.findOne({
      employee: employeeId,
      date: today,
      company: user.companyId,
    });

    if (existingAttendance) {
      if (existingAttendance.timeIn) {
        return res
          .status(400)
          .json({ message: "Already checked in for today" });
      }
    }

    const checkInTime = new Date();

    let attendance;
    if (existingAttendance) {
      // Update existing attendance record
      attendance = await Attendence.findByIdAndUpdate(
        existingAttendance._id,
        {
          timeIn: checkInTime,
          status: "present",
        },
        { new: true }
      );
    } else {
      // Create new attendance record
      attendance = await Attendence.create({
        employee: employeeId,
        date: today,
        timeIn: checkInTime,
        status: "present",
        company: user.companyId,
      });
    }

    res.status(200).json({ message: "Checked in successfully", attendance });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error checking in", error: error.message });
  }
};

export const CHECKOUT = async (req, res) => {
  try {
    const employeeId = req.user.userId;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const user = await User.findById(employeeId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find today's attendance record
    const existingAttendance = await Attendence.findOne({
      employee: employeeId,
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      },
      company: user.companyId,
    });

    if (!existingAttendance) {
      return res
        .status(400)
        .json({ message: "No check-in record found for today" });
    }

    if (!existingAttendance.timeIn) {
      return res
        .status(400)
        .json({ message: "Must check-in before checking out" });
    }

    if (existingAttendance.timeOut) {
      return res.status(400).json({ message: "Already checked out for today" });
    }

    const checkOutTime = new Date();

    const attendance = await Attendence.findByIdAndUpdate(
      existingAttendance._id,
      {
        timeOut: checkOutTime,
      },
      { new: true }
    );

    res.status(200).json({ message: "Checked out successfully", attendance });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error checking out", error: error.message });
  }
};

export const GET_MY_ATTENDANCE = async (req, res) => {
  try {
    const employeeId = req.user.userId;
    const { startDate, endDate } = req.query;

    const query = { employee: employeeId };

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const attendance = await Attendence.find(query).sort({ date: -1 });

    // if (!attendance.length) {
    //   return res.status(404).json({ message: "No attendance records found" });
    // }

    res
      .status(200)
      .json({ message: "Attendance records fetched successfully", attendance });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching attendance", error: error.message });
  }
};

// For admin/HR to view all attendance records
export const GET_ALL_ATTENDANCE = async (req, res) => {
  try {
    const { startDate, endDate, employeeId } = req.query;

    const query = { company: req.user.userId };

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    if (employeeId) {
      query.employeeId = employeeId;
    }

    const attendance = await Attendence.find(query)
      .populate("employee", "name profile employeeId")
      .sort({ date: -1 });

    // if (!attendance.length) {
    //   return res.status(404).json({ message: "No attendance records found" });
    // }
    res
      .status(200)
      .json({ message: "Attendance records fetched successfully", attendance });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching attendance records",
      error: error.message,
    });
  }
};

// For admin/HR to generate attendance report
export const GET_ATTENDANCE_REPORT = async (req, res) => {
  try {
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({ message: "Month and year are required" });
    }

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const attendance = await Attendence.aggregate([
      {
        $match: {
          companyId: req.user.companyId,
          date: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $group: {
          _id: "$employeeId",
          totalPresent: {
            $sum: { $cond: [{ $eq: ["$status", "present"] }, 1, 0] },
          },
          totalAbsent: {
            $sum: { $cond: [{ $eq: ["$status", "absent"] }, 1, 0] },
          },
          averageWorkingHours: {
            $avg: {
              $divide: [
                { $subtract: ["$checkOut", "$checkIn"] },
                1000 * 60 * 60, // Convert milliseconds to hours
              ],
            },
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "employeeDetails",
        },
      },
      {
        $unwind: "$employeeDetails",
      },
    ]);

    res.status(200).json({
      message: "Attendance report generated successfully",
      attendance,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error generating attendance report",
      error: error.message,
    });
  }
};
