import ShiftScheduling from "../models/shift-scheduling.js";
import User from "../models/user.js";

export const GET_SHIFT_SCHEDULING = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    const query =
      user.role === "employee"
        ? { company: user.companyId }
        : { company: user._id };
    const shiftScheduling = await ShiftScheduling.find(query);
  
    res.status(200).json({
      message: "Shift scheduling fetched successfully",
      shiftScheduling,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const CREATE_SHIFT_SCHEDULING = async (req, res) => {
  try {
    // Validate required fields
    const { title, startTime, maxStartTime, endTime, minEndTime } = req.body;
    if (!title || !startTime || !endTime) {
      return res
        .status(400)
        .json({ message: "Title, startTime, and endTime are required fields" });
    }

    // Validate if a shift with the same title already exists
    const existingSchedule = await ShiftScheduling.findOne({
      title,
      $or: [
        {
          startTime: { $lte: endTime },
          endTime: { $gte: startTime },
        },
      ],
      company: req.user.userId,
    });

    if (existingSchedule) {
      return res
        .status(400)
        .json({
          message: "A shift with the same title already exists in the given time range",
        });
    }

    const shiftScheduling = new ShiftScheduling({
      title,
      startTime,
      maxStartTime,
      endTime,
      minEndTime,
      company: req.user.userId,
    });
    await shiftScheduling.save();
    res.status(201).json(shiftScheduling);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const UPDATE_SHIFT_SCHEDULING = async (req, res) => {
  try {
    const { id } = req.params;
    const { ...data } = req.body;

    // Validate if schedule exists
    const existingSchedule = await ShiftScheduling.findById(id);
    if (!existingSchedule) {
      return res.status(404).json({ message: "Shift schedule not found" });
    }

    // Validate if user has permission
    if (existingSchedule.company.toString() !== req.user.userId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this schedule" });
    }

    // If time or title is being updated, check for conflicts
    if (data.startTime || data.endTime || data.title) {
      const startTime = data.startTime || existingSchedule.startTime;
      const endTime = data.endTime || existingSchedule.endTime;
      const title = data.title || existingSchedule.title;

      const conflictSchedule = await ShiftScheduling.findOne({
        title,
        $or: [
          {
            startTime: { $lte: endTime },
            endTime: { $gte: startTime },
          },
        ],
        _id: { $ne: id },
        company: req.user.userId,
      });

      if (conflictSchedule) {
        return res
          .status(400)
          .json({
            message: "A shift with the same title already exists in the given time range",
          });
      }
    }

    const shiftScheduling = await ShiftScheduling.findByIdAndUpdate(id, data, {
      new: true,
    });
    res.status(200).json(shiftScheduling);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const DELETE_SHIFT_SCHEDULING = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate if schedule exists
    const schedule = await ShiftScheduling.findById(id);
    if (!schedule) {
      return res.status(404).json({ message: "Shift schedule not found" });
    }

    // Validate if user has permission
    if (schedule.company.toString() !== req.user.userId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this schedule" });
    }

    await ShiftScheduling.findByIdAndDelete(id);
    res.status(200).json({ message: "Shift scheduling deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
