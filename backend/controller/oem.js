import OEM from "../models/oem.js";
import User from "../models/user.js";

export const createOEM = async (req, res) => {
  try {
    const { name } = req.body;
    const oem = new OEM({ name, companyId: req.user.userId });
    await oem.save();
    res.status(200).json(oem);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating OEM", error: error.message });
  }
};

export const getOEMs = async (req, res) => {
  try {
    let companyId;
    const user = await User.findById(req.user.userId);

    if (user.role === "admin") {
      companyId = user._id;
    } else if (req.user.role === "employee") {
      companyId = user.companyId;
    } else {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    const oems = await OEM.find({ companyId, status: "active" });
    res.status(200).json({ oems });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching OEMs", error: error.message });
  }
};

export const updateOEM = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, status } = req.body;

    const oem = await OEM.findByIdAndUpdate(
      id,
      { name, status },
      { new: true }
    );
    if (!oem) {
      return res.status(404).json({ message: "OEM not found" });
    }

    res.status(200).json(oem);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating OEM", error: error.message });
  }
};

export const deleteOEM = async (req, res) => {
  try {
    const { id } = req.params;

    const oem = await OEM.findByIdAndDelete(id);
    if (!oem) {
      return res.status(404).json({ message: "OEM not found" });
    }

    res.status(200).json({ message: "OEM deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting OEM", error: error.message });
  }
};
