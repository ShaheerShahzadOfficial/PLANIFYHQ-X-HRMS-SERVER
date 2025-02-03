import express from "express";
import {
  createSheet,
  updateSheet,
  deleteSheet,
  getSheetsByCompany,
  getAllSheets,
  getSheetById,
} from "../../controller/resourse/sheet.js";
import { auth } from "../../middleware/auth.middleware.js";
const SheetRouter = express.Router();

SheetRouter.post("/", auth, createSheet);
SheetRouter.put("/:id", auth, updateSheet);
SheetRouter.delete("/:id", auth, deleteSheet);
SheetRouter.get("/company", auth, getSheetsByCompany);
// SheetRouter.get("/all", getAllSheets);
// SheetRouter.get("/:id", getSheetById);

export default SheetRouter;
