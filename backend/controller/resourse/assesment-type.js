import AssesmentType from "../../models/resourse/assesment-type.js";

export const createAssesmentType = async (req, res) => {
  const { name } = req.body;
  const companyId = req.user.userId;

  if (!name) {
    return res.status(400).json({ message: "Name is required" });
  }

  try {
    const existingAssesmentType = await AssesmentType.findOne({
      name,
      company: companyId,
    });
    if (existingAssesmentType) {
      return res
        .status(409)
        .json({ message: "Assesment type with this name already exists" });
    }

    const assesmentType = new AssesmentType({
      name,
      company: companyId,
    });
    await assesmentType.save();
    res.status(201).json(assesmentType);
  } catch (error) {
    console.error("Error creating assesment type:", error);
    res
      .status(500)
      .json({ message: "Error creating assesment type", error: error.message });
  }
};

export const updateAssesmentType = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const companyId = req.user.userId;

  if (!name) {
    return res.status(400).json({ message: "Name is required" });
  }

  try {
    const assesmentType = await AssesmentType.findOne({
      _id: id,
      company: companyId,
    });
    if (!assesmentType) {
      return res.status(404).json({ message: "Assesment type not found" });
    }

    if (name && name !== assesmentType.name) {
      const existingAssesmentType = await AssesmentType.findOne({
        name,
        company: companyId,
        _id: { $ne: id },
      });
      if (existingAssesmentType) {
        return res.status(409).json({
          message: "Another assesment type with this name already exists",
        });
      }
    }

    assesmentType.name = name || assesmentType.name;

    await assesmentType.save();
    res.status(200).json(assesmentType);
  } catch (error) {
    console.error("Error updating assesment type:", error);
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid asset type ID" });
    }
    res
      .status(500)
      .json({ message: "Error updating assesment type", error: error.message });
  }
};

export const deleteAssesmentType = async (req, res) => {
  const { id } = req.params;
  const companyId = req.user.userId;

  try {
    const assesmentType = await AssesmentType.findOne({
      _id: id,
      company: companyId,
    });
    if (!assesmentType) {
      return res.status(404).json({ message: "Assesment type not found" });
    }

    // Check if the asset type is being used anywhere before deleting
    // This is a placeholder. You should implement the actual check based on your data model
    const isAssetTypeInUse = false; // await checkIfAssetTypeIsInUse(id);
    if (isAssetTypeInUse) {
      return res
        .status(400)
        .json({ message: "Cannot delete assesment type as it is in use" });
    }

    await AssesmentType.findByIdAndDelete(id);
    res.status(200).json({ message: "Assesment type deleted successfully" });
  } catch (error) {
    console.error("Error deleting assesment type:", error);
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid assesment type ID" });
    }
    res
      .status(500)
      .json({ message: "Error deleting assesment type", error: error.message });
  }
};

export const getAssesmentType = async (req, res) => {
  const companyId = req.user.userId;
  try {
    const assesmentType = await AssesmentType.find({ company: companyId });
    res.status(200).json(assesmentType);
  } catch (error) {
    console.error("Error fetching assesment types:", error);
    res
      .status(500)
      .json({
        message: "Error fetching assesment types",
        error: error.message,
      });
  }
};
