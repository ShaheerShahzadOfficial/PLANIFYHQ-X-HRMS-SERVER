import Plan from "../models/plan.js";

export const createPlan = async (req, res) => {
  const { name, price, features } = req.body;

  // Validate required fields
  if (!name || price === undefined) {
    return res.status(400).json({ message: "Name and price are required fields" });
  }

  // Validate price is not negative
  if (price < 0) {
    return res.status(400).json({ message: "Price cannot be negative" });
  }

  // Validate name length
  if (name.length < 3 || name.length > 50) {
    return res.status(400).json({ message: "Name must be between 3 and 50 characters" });
  }

  // Validate features array if provided
  if (features && !Array.isArray(features)) {
    return res.status(400).json({ message: "Features must be an array" });
  }

  try {
    // Check if plan with same name already exists
    const existingPlan = await Plan.findOne({ name, isDeleted: false });
    if (existingPlan) {
      return res.status(400).json({ message: "Plan with this name already exists" });
    }

    const plan = await Plan.create({ name, price, features });
    res.status(201).json({ message: "Plan created successfully", plan });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating plan", error: error.message });
  }
};


export const getPlans = async (req, res) => {
  const plans = await Plan.find({ isDeleted: false });
  res.status(200).json({ message: "Plans fetched successfully", plans });
};
