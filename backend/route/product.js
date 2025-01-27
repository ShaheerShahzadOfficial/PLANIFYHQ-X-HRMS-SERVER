import {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
} from "../controller/product.js";

import express from "express";

import { auth } from "../middleware/auth.middleware.js";

const productRouter = express.Router();

productRouter.post("/create", auth, createProduct);
 
productRouter.get("/get", auth, getProducts);

productRouter.put("/update/:id", auth, updateProduct);

productRouter.delete("/delete/:id", auth, deleteProduct);

export default productRouter;