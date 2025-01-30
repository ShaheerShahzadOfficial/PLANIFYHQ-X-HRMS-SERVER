import ResourseSalary from "../../models/resourse/salary.js";

const CREATE_SALARY = async (req, res) => {
  try {
    const { department, designation, monthlySalary, noOfDays } = req.body;

    // Validate required fields
    if (!department || !designation || !monthlySalary) {
      return res.status(400).json({
        message:
          "Department, designation and monthly salary are required fields",
      });
    }

    // Validate monthlySalary is a positive number
    if (isNaN(monthlySalary) || monthlySalary <= 0) {
      return res.status(400).json({
        message: "Monthly salary must be a positive number",
      });
    }

    // Calculate daily and hourly salaries
    const workingDays = noOfDays || 20; // Default working days per month
    const hoursPerDay = 8; // Standard work hours per day

    // Validate noOfDays is a positive number
    if (isNaN(workingDays) || workingDays <= 0) {
      return res.status(400).json({
        message: "Number of working days must be a positive number",
      });
    }

    const dailySalary = monthlySalary / workingDays;
    const hourlySalary = dailySalary / hoursPerDay;

    const salary = new ResourseSalary({
      department,
      designation,
      company: req.user.userId,
      monthlySalary,
      noOfDays: workingDays,
      dailySalary,
      hourlySalary,
    });

    await salary.save();
    res.status(201).json(salary);
  } catch (error) {
    // Handle mongoose validation errors
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Invalid data provided",
        errors: Object.values(error.errors).map((err) => err.message),
      });
    }

    // Handle mongoose cast errors (invalid ObjectId)
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid department or designation ID format",
      });
    }

    // Handle other errors
    console.error("Error creating salary:", error);
    res.status(500).json({
      message: "Internal server error while creating salary",
    });
  }
};

const GET_SALARY = async (req, res) => {
  try {
    const salary = await ResourseSalary.find({
      company: req.user.userId,
    }).populate("department designation company");

    res.status(200).json({ salary });
  } catch (error) {
    console.error("Error fetching salaries:", error);
    res
      .status(500)
      .json({ message: "Internal server error while fetching salaries" });
  }
};

const GET_SALARY_BY_ID = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ message: "Salary ID is required" });
    }

    const salary = await ResourseSalary.findById(req.params.id);
    if (!salary) {
      return res.status(404).json({ message: "Salary record not found" });
    }
    if (salary.company !== req.user.userId) {
      return res.status(404).json({ message: "Unauthorized access" });
    }

    res.status(200).json({ salary });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid salary ID format" });
    }
    console.error("Error fetching salary by ID:", error);
    res
      .status(500)
      .json({ message: "Internal server error while fetching salary" });
  }
};

const UPDATE_SALARY = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ message: "Salary ID is required" });
    }

    // Validate the request body
    const { monthlySalary, noOfDays } = req.body;
    if (monthlySalary && (isNaN(monthlySalary) || monthlySalary <= 0)) {
      return res
        .status(400)
        .json({ message: "Monthly salary must be a positive number" });
    }
    if (noOfDays && (isNaN(noOfDays) || noOfDays <= 0)) {
      return res
        .status(400)
        .json({ message: "Number of days must be a positive number" });
    }

    const salary = await ResourseSalary.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!salary) {
      return res.status(404).json({ message: "Salary record not found" });
    }

    res.status(200).json({ salary });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Invalid data provided",
        errors: Object.values(error.errors).map((err) => err.message),
      });
    }
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid salary ID format" });
    }
    console.error("Error updating salary:", error);
    res
      .status(500)
      .json({ message: "Internal server error while updating salary" });
  }
};

const DELETE_SALARY = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ message: "Salary ID is required" });
    }

    const salary = await ResourseSalary.findByIdAndDelete(req.params.id);
    if (!salary) {
      return res.status(404).json({ message: "Salary record not found" });
    }

    res.status(200).json({ message: "Salary deleted successfully" });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid salary ID format" });
    }
    console.error("Error deleting salary:", error);
    res
      .status(500)
      .json({ message: "Internal server error while deleting salary" });
  }
};

export {
  CREATE_SALARY,
  GET_SALARY,
  GET_SALARY_BY_ID,
  UPDATE_SALARY,
  DELETE_SALARY,
};
