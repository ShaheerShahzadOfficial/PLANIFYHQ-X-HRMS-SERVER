import Delivery from "../../models/resourse/delivery.js";

export const createDelivery = async (req, res) => {
  const { name } = req.body;
  const companyId = req.user.userId;

  if (!name ) {
    return res.status(400).json({ message: "Name and status are required" });
  }

  try {
    const existingDelivery = await Delivery.findOne({
      name,
      company: companyId,
    });
    if (existingDelivery) {
      return res
        .status(409)
        .json({ message: "Delivery with this name already exists" });
    }

    const delivery = new Delivery({
      name,
      company: companyId,
    });
    await delivery.save();
    res.status(201).json(delivery);
  } catch (error) {
    console.error("Error creating delivery:", error);
    res
      .status(500)
      .json({ message: "Error creating delivery", error: error.message });
  }
};

export const updateDelivery = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const companyId = req.user.userId;

  if (!name) {
    return res
      .status(400)
      .json({
        message: "At least one field (name or status) is required for update",
      });
  }

  try {
    const delivery = await Delivery.findOne({
      _id: id,
      company: companyId,
    });
    if (!delivery) {
      return res.status(404).json({ message: "Delivery not found" });
    }

    if (name && name !== delivery.name) {
      const existingDelivery = await Delivery.findOne({
        name,
        company: companyId,
        _id: { $ne: id },
      });
      if (existingDelivery) {
        return res
          .status(409)
          .json({
            message: "Another delivery with this name already exists",
          });
      }
    }

    delivery.name = name || delivery.name;

    await delivery.save();
    res.status(200).json(delivery);
  } catch (error) {
    console.error("Error updating delivery:", error);
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid delivery ID" });
    }
    res
      .status(500)
      .json({ message: "Error updating delivery", error: error.message });
  }
};

export const deleteDelivery = async (req, res) => {
  const { id } = req.params;
  const companyId = req.user.userId;

  try {
    const delivery = await Delivery.findOne({
      _id: id,
      company: companyId,
    });
    if (!delivery) {
      return res.status(404).json({ message: "Delivery not found" });
    }

    // Check if the delivery is being used anywhere before deleting
    // This is a placeholder. You should implement the actual check based on your data model
    const isDeliveryInUse = false; // await checkIfAssetTypeIsInUse(id);
    if (isDeliveryInUse) {
      return res
        .status(400)
        .json({ message: "Cannot delete delivery as it is in use" });
    }

    await Delivery.findByIdAndDelete(id);
    res.status(200).json({ message: "Delivery deleted successfully" });
  } catch (error) {
    console.error("Error deleting delivery:", error);
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid delivery ID" });
    }
    res
      .status(500)
      .json({ message: "Error deleting delivery", error: error.message });
  }
};

export const getDelivery = async (req, res) => {
  const companyId = req.user.userId;
  
  try {
    const delivery = await Delivery.find({ company: companyId });
    res.status(200).json(delivery);
  } catch (error) {
    console.error("Error fetching deliveries:", error);
    res.status(500).json({ 
      message: "Error fetching deliveries", 
      error: error.message 
    });
  }
};

