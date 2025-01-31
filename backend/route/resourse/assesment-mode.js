import express from "express";
import { createAssesmentMode, deleteAssesmentMode, getAssesmentMode, updateAssesmentMode } from "../../controller/resourse/assesment-mode.js";
import { auth } from "../../middleware/auth.middleware.js";
const assesmentModeRouter = express.Router();

assesmentModeRouter.post("/create", auth, createAssesmentMode);
assesmentModeRouter.get("/get", auth, getAssesmentMode);
assesmentModeRouter.put("/update/:id", auth, updateAssesmentMode);
assesmentModeRouter.delete("/delete/:id", auth, deleteAssesmentMode);
export default assesmentModeRouter;
