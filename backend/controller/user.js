import User from "../models/user.js";
import bcrypt from "bcrypt";
import cloudinary from "cloudinary";
import jwt from "jsonwebtoken";
import { parse } from "date-fns";
import BankInfo from "../models/bank-info.js";
import PersonalInfo from "../models/personal-info.js";
import EmergencyContact from "../models/emergency-contact.js";
import Experience from "../models/experience.js";
import EducationDetails from "../models/education-details.js";
import AssestAssignment from "../models/assest-assignment.js";
export const createUser = async (req, res) => {
  const {
    name,
    email,
    password,
    phoneNumber,
    role = "admin",
    website,
    profile,
    address,
    planId,
    status,
    language,
    isDeleted,
    currency,
  } = req.body;

  // Validate required fields
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "Name, email and password are required fields" });
  }

  // Validate name length
  if (name.length < 2 || name.length > 50) {
    return res
      .status(400)
      .json({ message: "Name must be between 2 and 50 characters" });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  // Validate password strength
  if (password.length < 8) {
    return res
      .status(400)
      .json({ message: "Password must be at least 8 characters long" });
  }

  // Validate phone number if provided
  if (phoneNumber) {
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return res.status(400).json({ message: "Invalid phone number format" });
    }
  }

  // Validate website format if provided
  if (website) {
    const urlRegex =
      /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
    if (!urlRegex.test(website)) {
      return res.status(400).json({ message: "Invalid website URL format" });
    }
  }

  // Check if user with same email already exists
  const existingUser = await User.findOne({ email, isDeleted: false });
  if (existingUser) {
    return res
      .status(400)
      .json({ message: "User with this email already exists" });
  }

  try {
    // Hash password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let profileData = {};
    if (profile) {
      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(profile, {
        folder: "profiles",
      });
      profileData = {
        url: result.secure_url,
        public_id: result.public_id,
      };
    }

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phoneNumber,
      role,
      website,
      profile: profileData,
      address,
      planId,
      status,
      language,
      isDeleted,
      currency,
    });

    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating user", error: error.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }
  if (user.isDeleted || user.status === "inactive") {
    return res.status(401).json({ message: "Account is disabled" });
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid email or password" });
  }
  const token = jwt.sign(
    { userId: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );
  res.status(200).json({ message: "Login successful", user, token });
};

export const GET_MY_PROFILE = async (req, res) => {
  try {
    if (!req.user?.userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await User.findById(req.user.userId).populate(
      "department designation"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isDeleted || user.status === "inactive") {
      return res.status(403).json({ message: "Account is disabled" });
    }

    res.status(200).json({ message: "Profile fetched successfully", user });
  } catch (error) {
    console.error("Error fetching profile:", error);
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid user ID format" });
    }
    res.status(500).json({
      message: "Error fetching profile",
      error: error.message,
    });
  }
};

export const CREATE_EMPLOYEE = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phoneNumber,
      role,
      profile,
      designation,
      department,
      about,
      joinedAt,
      employeeId,
    } = req.body;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    let profileData = {};
    if (profile) {
      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(profile, {
        folder: "profiles",
      });
      profileData = {
        url: result.secure_url,
        public_id: result.public_id,
      };
    }

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phoneNumber,
      role,
      profile: profileData,
      companyId: req.user.userId,
      designation,
      department,
      about,
      joinedAt: parse(joinedAt, "dd-MM-yyyy", new Date()),
      employeeId,
    });

    res.status(200).json({ message: "Employee created successfully", user });
  } catch (error) {
    res.status(500).json({
      message: "Error creating employee",
      error: error.message,
    });
  }
};

export const GET_EMPLOYEES = async (req, res) => {
  const employees = await User.find({
    role: "employee",
    companyId: req.user.userId,
  })
    .select("-password")
    .populate("designation department");
  res
    .status(200)
    .json({ message: "Employees fetched successfully", employees });
};

export const UPDATE_EMPLOYEE = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    email,
    phoneNumber,
    designation,
    department,
    about,
    joinedAt,
    employeeId,
    profile,
    status,
  } = req.body;
  let profileData = {};
  if (profile) {
    // Check if user has existing profile and delete it
    // Only upload if profile is a base64 URL
    if (profile?.url?.startsWith("data:image")) {
      // Delete existing profile if it exists
      const existingUser = await User.findById(id);
      if (existingUser.profile && existingUser.profile.public_id) {
        await cloudinary.uploader.destroy(existingUser.profile.public_id);
      }

      const result = await cloudinary.uploader.upload(profile?.url, {
        folder: "profiles",
      });
      profileData = {
        url: result.secure_url,
        public_id: result.public_id,
      };
    }
  }
  const employee = await User.findByIdAndUpdate(
    id,
    {
      name,
      email,
      phoneNumber,
      designation,
      department,
      about,
      joinedAt,
      employeeId,
      status,
      ...(Object.keys(profileData).length > 0
        ? { profile: profileData }
        : { profile: profile }),
    },
    { new: true }
  );
  res.status(200).json({ message: "Employee updated successfully", employee });
};

export const DELETE_EMPLOYEE = async (req, res) => {
  const { id } = req.params;
  const employee = await User.findByIdAndDelete(id);
  res.status(200).json({ message: "Employee deleted successfully", employee });
};

export const GET_COMPANIES = async (req, res) => {
  const companies = await User.find({ role: "admin" })
    .select("-password")
    .populate("planId");
  res
    .status(200)
    .json({ message: "Companies fetched successfully", companies });
};
export const UPDATE_COMPANY = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      email,
      phoneNumber,
      website,
      address,
      currency,
      status,
      language,
      profile,
      about,
    } = req.body;

    // Validate required fields
    if (!name || !email) {
      return res
        .status(400)
        .json({ message: "Name and email are required fields" });
    }

    // Validate name length
    if (name.length < 2 || name.length > 50) {
      return res
        .status(400)
        .json({ message: "Name must be between 2 and 50 characters" });
    }

    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Validate phone number if provided
    if (phoneNumber) {
      const phoneRegex = /^\+?[1-9]\d{9,14}$/;
      const phoneStr = String(phoneNumber).replace(/[\s-]/g, "");
      if (!phoneRegex.test(phoneStr)) {
        return res
          .status(400)
          .json({ message: "Please enter a valid phone number" });
      }
    }

    // Validate website if provided
    if (website) {
      const urlRegex =
        /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
      if (!urlRegex.test(website)) {
        return res
          .status(400)
          .json({ message: "Please enter a valid website URL" });
      }
    }

    // Handle profile image upload if provided
    let profileData = {};
    if (profile && profile.startsWith("data:")) {
      try {
        // Delete existing profile if it exists
        const existingCompany = await User.findById(id);
        if (
          existingCompany &&
          existingCompany.profile &&
          existingCompany.profile.public_id
        ) {
          await cloudinary.uploader.destroy(existingCompany.profile.public_id);
        }

        const result = await cloudinary.uploader.upload(profile, {
          folder: "profiles",
        });
        profileData = {
          url: result.secure_url,
          public_id: result.public_id,
        };
      } catch (cloudinaryError) {
        console.error("Error uploading image to cloudinary:", cloudinaryError);
        return res
          .status(500)
          .json({ message: "Error uploading profile image" });
      }
    }

    const updatedCompany = await User.findByIdAndUpdate(
      id,
      {
        name,
        email,
        phoneNumber,
        website,
        address,
        currency,
        status,
        language,
        about,
        updatedAt: Date.now(),
        ...(Object.keys(profileData).length > 0
          ? { profile: profileData }
          : profile
          ? { profile }
          : {}),
      },
      { new: true }
    ).select("-password");

    if (!updatedCompany) {
      return res.status(404).json({ message: "Company not found" });
    }

    res.status(200).json({
      message: "Company updated successfully",
      updatedCompany,
    });
  } catch (error) {
    console.error("Error updating company:", error);
    res
      .status(500)
      .json({ message: error.message || "Error updating company details" });
  }
};

export const DELETE_COMPANY = async (req, res) => {
  const { id } = req.params;
  const company = await User.findByIdAndDelete(id);
  const employees = await User.find({ companyId: id });
  employees.forEach(async (employee) => {
    await User.findByIdAndDelete(employee._id);
  });
  res.status(200).json({ message: "Company deleted successfully", company });
};

export const DISABLE_COMPANY_EMPLOYEES_ACCOUNT = async (req, res) => {
  const { id } = req.params;
  const company = await User.findByIdAndUpdate(
    id,
    { isDeleted: true, status: "inactive" },
    { new: true }
  );
  const employees = await User.find({ companyId: id });
  employees.forEach(async (employee) => {
    await User.findByIdAndUpdate(
      employee._id,
      { isDeleted: true, status: "inactive" },
      { new: true }
    );
  });
  res.status(200).json({
    message: "Company employees account disabled successfully",
    company,
  });
};

export const GET_EMPLOYEE_BY_ID = async (req, res) => {
  const { id } = req.params;
  const requestingUser = req.user;

  const employee = await User.findById(id).populate("department designation");
  if (!employee) {
    return res.status(404).json({ message: "Employee not found" });
  }

  // Check if requesting user is from same company or is a company account
  // if (requestingUser.role !== "company" && requestingUser.userId.toString() !== employee.companyId.toString()) {
  //   return res.status(403).json({ message: "Unauthorized access - you can only view employees from your company" });
  // }

  const requester = await User.findById(requestingUser.userId);

  if (
    requester._id.toString() !== employee.companyId.toString() &&
    requester.companyId?.toString() !== employee.companyId?.toString()
  ) {
    return res.status(403).json({
      message:
        "Unauthorized access - you can only view employees from your company",
    });
  }

  const bankInfo = await BankInfo.findOne({ employeeId: id });
  const personalInfo = await PersonalInfo.findOne({ employeeId: id });
  const emergencyContact = await EmergencyContact.find({ employeeId: id });
  const experience = await Experience.find({ employeeId: id });
  const educationDetails = await EducationDetails.find({ employeeId: id });
  const assestAssignment = await AssestAssignment.find({
    employeeId: id,
  }).populate("assestId");
  res.status(200).json({
    message: "Employee fetched successfully",
    employee,
    bankInfo,
    personalInfo,
    emergencyContact,
    experience,
    educationDetails,
    assestAssignment,
  });
};
