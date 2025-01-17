import Shift from "../models/shift";

const CREATE_SHIFT = async (req, res) => {
  try {
    // Validate required fields

    if (!req.body.name) {
      return res.status(400).json({ message: "Shift name is required" });
    }

    // Check if shift with same name already exists
    const existingShift = await Shift.findOne({
      name: req.body.name,
      company: req.user.userId,
    });
    if (existingShift) {
      return res
        .status(400)
        .json({ message: "Shift with this name already exists" });
    }

    const shift = new Shift(req.body);
    await shift.save();
    res.status(201).json(shift);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const UPDATE_SHIFT = async (req, res) => {
  try {
    // Validate if shift exists
    const existingShift = await Shift.findById(req.params.id);
    if (!existingShift) {
      return res.status(404).json({ message: "Shift not found" });
    }

    // Validate if user has permission to update this shift
    if (existingShift.company.toString() !== req.user.userId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this shift" });
    }

    // Validate request body
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "No update data provided" });
    }

    // Validate name if provided
    if (req.body.name) {
      if (req.body.name.trim().length < 2) {
        return res
          .status(400)
          .json({ message: "Shift name must be at least 2 characters long" });
      }

      // Check if new name conflicts with existing shift
      const nameConflict = await Shift.findOne({
        name: req.body.name,
        company: req.user.userId,
        _id: { $ne: req.params.id },
      });
      if (nameConflict) {
        return res
          .status(400)
          .json({ message: "Shift with this name already exists" });
      }
    }

    const shift = await Shift.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json(shift);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const DELETE_SHIFT = async (req, res) => {
  try {
    // Validate if shift exists
    const shift = await Shift.findById(req.params.id);
    if (!shift) {
      return res.status(404).json({ message: "Shift not found" });
    }

    if (shift.company.toString() !== req.user.userId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this shift" });
    }

    await Shift.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Shift deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const GET_SHIFTS = async (req, res) => {
  try {
    const shifts = await Shift.find({ company: req.user.userId });
    if (!shifts.length) {
      return res.status(404).json({ message: "No shifts found" });
    }
    res.status(200).json({ message: "Shifts fetched successfully", shifts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { CREATE_SHIFT, UPDATE_SHIFT, DELETE_SHIFT, GET_SHIFTS };
