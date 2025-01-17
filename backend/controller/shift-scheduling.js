import ShiftScheduling from "../models/shift-scheduling";

export const GET_SHIFT_SCHEDULING = async (req, res) => {
  try {
    const shiftScheduling = await ShiftScheduling.find({ company: req.user.userId });
    if (!shiftScheduling.length) {
      return res.status(404).json({ message: "No shift schedules found" });
    }
    res.status(200).json({ message: "Shift scheduling fetched successfully", shiftScheduling });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const CREATE_SHIFT_SCHEDULING = async (req, res) => {
  try {
    // Validate required fields
    const { employee, shift, date } = req.body;
    if (!employee || !shift || !date) {
      return res.status(400).json({ message: "Employee, shift and date are required fields" });
    }

    // Validate if employee already has a shift scheduled for this date
    const existingSchedule = await ShiftScheduling.findOne({
      employee,
      date,
      company: req.user.userId
    });

    if (existingSchedule) {
      return res.status(400).json({ message: "Employee already has a shift scheduled for this date" });
    }

    const shiftScheduling = new ShiftScheduling({
      ...req.body,
      company: req.user.userId
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
      return res.status(403).json({ message: "You are not authorized to update this schedule" });
    }

    // If date or employee is being updated, check for conflicts
    if (data.date || data.employee) {
      const conflictSchedule = await ShiftScheduling.findOne({
        employee: data.employee || existingSchedule.employee,
        date: data.date || existingSchedule.date,
        _id: { $ne: id },
        company: req.user.userId
      });

      if (conflictSchedule) {
        return res.status(400).json({ message: "Employee already has a shift scheduled for this date" });
      }
    }

    const shiftScheduling = await ShiftScheduling.findByIdAndUpdate(id, data, { new: true });
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
      return res.status(403).json({ message: "You are not authorized to delete this schedule" });
    }

    await ShiftScheduling.findByIdAndDelete(id);
    res.status(200).json({ message: "Shift scheduling deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
