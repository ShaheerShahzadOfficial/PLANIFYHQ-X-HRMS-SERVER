import Activity from "../models/activity.js";
import User from "../models/user.js";

export const createActivity = async (req, res) => {
  try {
    const { name } = req.body;
    const activity = new Activity({ name, companyId: req.user.userId });
    await activity.save();
    res.status(201).json(activity);
  } catch (error) {
    res.status(500).json({
      message: "Error creating activity",
      error: error.message,
    });
  }
};

export const getActivities = async (req, res) => {
  try {
    let companyId;
    const user = await User.findById(req.user.userId);

    if (user.role === "admin") {
      companyId = user._id;
    } else if (user.role === "employee") {
      companyId = user.companyId;
    } else {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    const activities = await Activity.find({ companyId, status: "active" });
    res.status(200).json({activities});
  } catch (error) {
    res.status(500).json({
      message: "Error fetching activities",
      error: error.message,
    });
  }
};

export const updateActivity = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, status } = req.body;
    const activity = await Activity.findByIdAndUpdate(id, { name, status }, { new: true });
    
    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    res.status(200).json(activity);
  } catch (error) {
    res.status(500).json({
      message: "Error updating activity",
      error: error.message,
    });
  }
};

export const deleteActivity = async (req, res) => {
  try {
    const { id } = req.params;
    const activity = await Activity.findByIdAndDelete(id);

    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    res.status(200).json({ message: "Activity deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting activity", 
      error: error.message,
    });
  }
};
