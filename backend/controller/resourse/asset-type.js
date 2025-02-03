import AssetType from "../../models/resourse/asset-type.js";

export const createAssetType = async (req, res) => {
  const { name } = req.body;
  const companyId = req.user.userId;

  if (!name) {
    return res.status(400).json({ message: "Name is required" });
  }

  try {
    const existingAssetType = await AssetType.findOne({
      name,
      company: companyId,
    });
    if (existingAssetType) {
      return res
        .status(409)
        .json({ message: "Asset type with this name already exists" });
    }

    const assetType = new AssetType({ name, company: companyId });
    await assetType.save();
    res.status(201).json(assetType);
  } catch (error) {
    console.error("Error creating asset type:", error);
    res
      .status(500)
      .json({ message: "Error creating asset type", error: error.message });
  }
};

export const updateAssetType = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const companyId = req.user.userId;

  if (!name) {
    return res.status(400).json({ message: "Name is required" });
  }

  try {
    const assetType = await AssetType.findOne({ _id: id, company: companyId });
    if (!assetType) {
      return res.status(404).json({ message: "Asset type not found" });
    }

    if (name && name !== assetType.name) {
      const existingAssetType = await AssetType.findOne({
        name,
        company: companyId,
        _id: { $ne: id },
      });
      if (existingAssetType) {
        return res
          .status(409)
          .json({
            message: "Another asset type with this name already exists",
          });
      }
    }

    assetType.name = name || assetType.name;

    await assetType.save();
    res.status(200).json(assetType);
  } catch (error) {
    console.error("Error updating asset type:", error);
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid asset type ID" });
    }
    res
      .status(500)
      .json({ message: "Error updating asset type", error: error.message });
  }
};

export const deleteAssetType = async (req, res) => {
  const { id } = req.params;
  const companyId = req.user.userId;

  try {
    const assetType = await AssetType.findOne({ _id: id, company: companyId });
    if (!assetType) {
      return res.status(404).json({ message: "Asset type not found" });
    }
    
    // Check if the asset type is being used anywhere before deleting
    // This is a placeholder. You should implement the actual check based on your data model
    const isAssetTypeInUse = false; // await checkIfAssetTypeIsInUse(id);
    if (isAssetTypeInUse) {
      return res
        .status(400)
        .json({ message: "Cannot delete asset type as it is in use" });
    }

    await AssetType.findByIdAndDelete(id);
    res.status(200).json({ message: "Asset type deleted successfully" });
  } catch (error) {
    console.error("Error deleting asset type:", error);
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid asset type ID" });
    }
    res
      .status(500)
      .json({ message: "Error deleting asset type", error: error.message });
  }
};

export const getAssetType = async (req, res) => {
  const companyId = req.user.userId;
  try {
    const assetType = await AssetType.find({ company: companyId });
    res.status(200).json(assetType);
  } catch (error) {
    console.error("Error fetching asset types:", error);
    res
      .status(500)
      .json({ message: "Error fetching asset types", error: error.message });
  }
};
