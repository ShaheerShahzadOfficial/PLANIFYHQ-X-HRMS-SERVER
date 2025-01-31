import AssesmentMode from "../../models/resourse/assesment-mode.js";

export const createAssesmentMode = async (req, res) => {
  const { name } = req.body;
  const companyId = req.user.userId;

  if (!name) {
    return res.status(400).json({ message: "Name is required" });
  }

  try {
    const existingAssesmentMode = await AssesmentMode.findOne({
      name,
      company: companyId,
    });
    if (existingAssesmentMode) {
      return res
        .status(409)
        .json({ message: "Assesment mode with this name already exists" });
    }

    const assesmentMode = new AssesmentMode({
      name,
      company: companyId,
    });
    await assesmentMode.save();
    res.status(201).json(assesmentMode);
  } catch (error) {
    console.error("Error creating assesment mode:", error);
    res
      .status(500)
      .json({ message: "Error creating assesment mode", error: error.message });
  }
};

export const updateAssesmentMode = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const companyId = req.user.userId;

  if (!name) {
    return res.status(400).json({ message: "Name is required" });
  }

  try {
    const assesmentMode = await AssesmentMode.findOne({
      _id: id,
      company: companyId,
    });
    if (!assesmentMode) {
      return res.status(404).json({ message: "Assesment mode not found" });
    }

    if (name && name !== assesmentMode.name) {
      const existingAssesmentMode = await AssesmentMode.findOne({
        name,
        company: companyId,
        _id: { $ne: id },
      });
      if (existingAssesmentMode) {
        return res.status(409).json({
          message: "Another assesment mode with this name already exists",
        });
      }
    }

    assesmentMode.name = name || assesmentMode.name;

    await assesmentMode.save();
    res.status(200).json(assesmentMode);
  } catch (error) {
    console.error("Error updating assesment mode:", error);
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid assesment mode ID" });
    }
    res
      .status(500)
      .json({ message: "Error updating assesment mode", error: error.message });
  }
};

export const deleteAssesmentMode = async (req, res) => {
  const { id } = req.params;
  const companyId = req.user.userId;

  try {
    const assesmentMode = await AssesmentMode.findOne({
      _id: id,
      company: companyId,
    });
    if (!assesmentMode) {
      return res.status(404).json({ message: "Assesment mode not found" });
    }

    // Check if the asset type is being used anywhere before deleting
    // This is a placeholder. You should implement the actual check based on your data model
    const isAssesmentModeInUse = false; // await checkIfAssetTypeIsInUse(id);
    if (isAssesmentModeInUse) {
      return res
        .status(400)
        .json({ message: "Cannot delete assesment mode as it is in use" });
    }

    await AssesmentMode.findByIdAndDelete(id);
    res.status(200).json({ message: "Assesment mode deleted successfully" });
  } catch (error) {
    console.error("Error deleting assesment mode:", error);
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid assesment mode ID" });
    }
    res
      .status(500)
      .json({ message: "Error deleting assesment mode", error: error.message });
  }
};

export const getAssesmentMode = async (req, res) => {
  const companyId = req.user.userId;
  try {
    const assesmentMode = await AssesmentMode.find({ company: companyId });
    res.status(200).json(assesmentMode);
  } catch (error) {
    console.error("Error fetching assesment modes:", error);
    res
      .status(500)
      .json({
        message: "Error fetching assesment modes",
        error: error.message,
      });
  }
};
