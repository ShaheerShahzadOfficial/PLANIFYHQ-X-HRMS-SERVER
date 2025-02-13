import User from "../../models/user.js";
import Project from "../../models/project.js";
import Client from "../../models/client.js";
import TimeSheet from "../../models/timeSheet.js";
import Leave from "../../models/leave.js";
import Attendence from "../../models/attendence.js";
import mongoose from "mongoose";

export const getDashboardStats = async (req, res) => {
  try {
    const companyId = req.user.userId;

    // Get counts
    const employeeCount = await User.countDocuments({
      companyId,
      role: "employee",
      isDeleted: false,
    });

    const projectCount = await Project.countDocuments({
      company: companyId,
      status: "active",
    });

    const clientCount = await Client.countDocuments({
      companyId,
      status: "active",
    });

    // Get attendance stats for today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const attendanceCount = await Attendence.countDocuments({
      company: companyId,
      date: {
        $gte: today,
        $lt: tomorrow,
      },
    });

    // Get department-wise employee count
    const departmentStats = await User.aggregate([
      {
        $match: {
          companyId: new mongoose.Types.ObjectId(companyId),
          role: "employee",
          isDeleted: false,
        },
      },
      {
        $group: {
          _id: "$department",
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "departments",
          localField: "_id",
          foreignField: "_id",
          as: "department",
        },
      },
    ]);

    // Get recent projects
    const recentProjects = await Project.find({ company: companyId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("client");

    // Get pending leaves
    const pendingLeaves = await Leave.countDocuments({
      company: companyId,
      status: "pending",
    });

    // Get timesheet hours for current week
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);

    const timesheetHours = await TimeSheet.aggregate([
      {
        $match: {
          company: new mongoose.Types.ObjectId(companyId),
          date: {
            $gte: weekStart,
            $lt: weekEnd,
          },
        },
      },
      {
        $group: {
          _id: null,
          totalHours: { $sum: "$hours" },
        },
      },
    ]);

    // Get attendance overview for today
    const attendanceStats = await Attendence.aggregate([
      {
        $match: {
          company: new mongoose.Types.ObjectId(companyId),
          date: {
            $gte: today,
            $lt: tomorrow,
          },
        },
      },
      {
        $group: {
          _id: null,
          present: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $ne: ["$timeIn", null] },
                    { $ne: ["$timeOut", null] },
                  ],
                },
                1,
                0,
              ],
            },
          },
          absent: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$timeIn", null] },
                    { $eq: ["$timeOut", null] },
                  ],
                },
                1,
                0,
              ],
            },
          },
          //   late: {
          //     $sum: {
          //       $cond: [{ $gt: ["$timeIn", { $add: [today, 32400000] }] }, 1, 0], // 9 AM in milliseconds
          //     },
          //   },
        },
      },
    ]);

    // Get today's attendance with employee details
    const todaysAttendance = await Attendence.find({
      company: companyId,
      date: {
        $gte: today,
        $lt: tomorrow,
      },
    }).populate({
      path: "employee",
      populate: [{ path: "department" }, { path: "designation" }],
    });

    // Get all active employees
    const employees = await User.find({
      companyId,
      role: "employee",
    })
      .select("name email department")
      .populate("department");

    res.status(200).json({
      stats: {
        employeeCount,
        projectCount,
        clientCount,
        attendanceCount,
        pendingLeaves,
        weeklyHours: timesheetHours[0]?.totalHours || 0,
      },
      departmentStats,
      recentProjects,
      attendanceOverview: attendanceStats[0] || {
        present: 0,
        absent: 0,
        late: 0,
      },
      todaysAttendance,
      employees,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({
      message: "Error fetching dashboard statistics",
      error: error.message,
    });
  }
};

export const getEmployeeDashboardStats = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get employee's projects
    const projects = await Project.find({
      company: userId,
      status: "active",
    })
      .populate("client")
      .sort({ createdAt: -1 })
      .limit(5);

    // Get employee's attendance stats
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendanceStats = await Attendence.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          date: {
            $gte: today,
          },
        },
      },
      {
        $group: {
          _id: null,
          present: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $ne: ["$timeIn", null] },
                    { $ne: ["$timeOut", null] },
                  ],
                },
                1,
                0,
              ],
            },
          },
          absent: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$timeIn", null] },
                    { $eq: ["$timeOut", null] },
                  ],
                },
                1,
                0,
              ],
            },
          },
          late: {
            $sum: {
              $cond: [{ $gt: ["$timeIn", { $add: [today, 32400000] }] }, 1, 0], // 9 AM in milliseconds
            },
          },
        },
      },
    ]);

    // Get employee's timesheet hours for current week
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    weekStart.setHours(0, 0, 0, 0);

    const timesheetHours = await TimeSheet.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          date: {
            $gte: weekStart,
          },
        },
      },
      {
        $group: {
          _id: null,
          totalHours: { $sum: "$hours" },
        },
      },
    ]);

    // Get employee's leave stats
    const leaves = await Leave.find({
      userId: userId,
      status: "pending",
    }).countDocuments();

    // Get today's attendance
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todaysAttendance = await Attendence.findOne({
      employee: userId,
      date: {
        $gte: today,
        $lt: tomorrow,
      },
    }).populate({
      path: "employee",
      populate: [{ path: "department" }, { path: "designation" }],
    });

    // Get all attendance records for the employee
    const attendance = await Attendence.find({
      employee: userId,
    })
      .sort({ date: -1 })
      .populate({
        path: "employee",
        populate: [{ path: "department" }, { path: "designation" }],
      });

    res.status(200).json({
      stats: {
        projects: projects,
        weeklyHours: timesheetHours[0]?.totalHours || 0,
        pendingLeaves: leaves,
      },
      attendanceOverview: attendanceStats[0] || {
        present: 0,
        absent: 0,
        late: 0,
      },
      todaysAttendance: todaysAttendance || null,
      attendance: attendance || []
    });
  } catch (error) {
    console.error("Error fetching employee dashboard stats:", error);
    res.status(500).json({
      message: "Error fetching dashboard statistics",
      error: error.message,
    });
  }
};
