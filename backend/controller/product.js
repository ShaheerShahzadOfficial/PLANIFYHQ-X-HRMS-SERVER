import Product from "../models/product.js";
import User from "../models/user.js";

export const createProduct = async (req, res) => {
  try {
    const { name } = req.body;
    const product = new Product({ name, companyId: req.user.userId });
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({
      message: "Error creating product",
      error: error.message,
    });
  }
};

export const getProducts = async (req, res) => {
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

    const products = await Product.find({ companyId });
    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching products",
      error: error.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, status } = req.body;

    const product = await Product.findByIdAndUpdate(
      id,
      { name, status },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({
      message: "Error updating product",
      error: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting product",
      error: error.message,
    });
  }
};
